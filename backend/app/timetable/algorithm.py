import random
from typing import List, Dict, Any, Optional

class TimetableGenerator:
    HEAVY_SUBJECTS = ["Math", "Science", "English", "Physics", "Chemistry", "Biology"]

    def __init__(self, days: List[str], periods: int, workloads: List[Dict[str, Any]], 
                 drill_periods: List[Dict[str, Any]] = None, 
                 fixed_slots: List[Dict[str, Any]] = None,
                 class_teachers: Dict[int, int] = None, 
                 teacher_constraints: Dict[int, List[Dict[str, Any]]] = None,
                 class_ids: List[int] = None):
        """
        workloads: List of { "class_id", "subject_name", "teacher_id", "teacher_name", "periods_per_week", "is_double" }
        fixed_slots: List of { "day", "period", "subject" }
        """
        self.days = days
        self.periods_count = periods
        self.workloads = workloads
        self.drill_periods = drill_periods or []
        self.fixed_slots = fixed_slots or []
        self.class_teachers = class_teachers or {}
        self.teacher_constraints = teacher_constraints or {}
        
        self.grid = {}
        self.teacher_busy = {}
        
        # Use provided class_ids or derive from workloads
        self.class_ids = class_ids if class_ids is not None else list(set(w['class_id'] for w in workloads))
        self.teacher_ids = list(set(w['teacher_id'] for w in workloads))
        
        for cid in self.class_ids:
            self.grid[cid] = {day: [None] * self.periods_count for day in self.days}
            
        for tid in self.teacher_ids:
            self.teacher_busy[tid] = {day: [False] * self.periods_count for day in self.days}

        # 1. Apply Fixed Slots (Hard) - Level-wide events (Lunch, Assembly etc)
        for fs in self.fixed_slots:
            p_idx = fs['period'] - 1
            days_to_apply = [fs['day']] if fs.get('day') and fs['day'] != 'All' else self.days
            
            for d in days_to_apply:
                if d in self.days and 0 <= p_idx < self.periods_count:
                    for cid in self.class_ids:
                        self.grid[cid][d][p_idx] = {
                            "subject": fs.get('subject', 'Fixed Event'), 
                            "teacher_id": -1, 
                            "teacher_name": "N/A"
                        }

        # 2. Teacher Unavailability (Hard)
        for tid, constraints in self.teacher_constraints.items():
            if tid in self.teacher_busy:
                for cons in constraints:
                    p_idx = cons['period'] - 1
                    if cons['day'] in self.days and 0 <= p_idx < self.periods_count:
                        self.teacher_busy[tid][cons['day']][p_idx] = True

        # 3. Prepare Tasks
        self.remaining_tasks = []
        for w in self.workloads:
            # Handle Per-Class Fixed Slots (e.g. Drill)
            if w.get('day') and w.get('period'):
                p_idx = w['period'] - 1
                d = w['day']
                cid = w['class_id']
                if d in self.days and 0 <= p_idx < self.periods_count:
                    self.grid[cid][d][p_idx] = {
                        "subject": w['subject_name'],
                        "teacher_id": w['teacher_id'],
                        "teacher_name": w.get('teacher_name', 'N/A')
                    }
                    if w['teacher_id'] != -1:
                        self.teacher_busy[w['teacher_id']][d][p_idx] = True
                continue

            # If is_double, we group periods into pairs
            count = w['periods_per_week']
            if w.get('is_double'):
                while count >= 2:
                    self.remaining_tasks.append({**w, "type": "double"})
                    count -= 2
            
            # Remaining single periods
            for _ in range(count):
                self.remaining_tasks.append({**w, "type": "single"})

    def generate(self) -> Optional[Dict[int, Any]]:
        # Heuristic: Double periods first, then heavy subjects
        def task_priority(t):
            p = 0
            if t['type'] == 'double': p += 10
            if t['subject_name'] in self.HEAVY_SUBJECTS: p += 5
            return p

        self.remaining_tasks.sort(key=task_priority, reverse=True)
        
        if self._backtrack(0):
            return self.grid
        return None

    def _backtrack(self, task_idx):
        # Limit iterations to prevent infinite hanging
        if not hasattr(self, 'iterations'):
            self.iterations = 0
        self.iterations += 1
        if self.iterations > 200000:
            return False

        if task_idx == len(self.remaining_tasks):
            return True

        task = self.remaining_tasks[task_idx]
        cid = task['class_id']
        tid = task['teacher_id']
        sub = task['subject_name']
        is_double = task['type'] == 'double'
        
        # Possible slots
        slots = []
        for day in self.days:
            # If double, must have range(periods - 1)
            limit = self.periods_count - 1 if is_double else self.periods_count
            for p in range(limit):
                slots.append((day, p))
        
        # Shuffle for uniform distribution
        random.shuffle(slots)

        # Heuristics for slot selection:
        # - Heavy subjects: prefer earlier periods (0 to 3)
        # - Class teacher: prefer period 0
        is_class_teacher = self.class_teachers.get(cid) == tid
        is_heavy = sub in self.HEAVY_SUBJECTS

        def score_slot(slot):
            day, p = slot
            score = 0
            
            # 1. Favor days with fewer assigned periods for THIS class
            assigned_on_day = len([x for x in self.grid[cid][day] if x is not None])
            score -= assigned_on_day * 20 # Strong penalty for fuller days

            if p == 0:
                if is_class_teacher: score += 100
                else: score -= 50 # Avoid period 0 for non-class teachers
            
            if is_heavy and p < 4: score += 30 # Heavy subjects early
            if is_heavy and p >= 6: score -= 30 # Heavy subjects late
            
            return score

        slots.sort(key=score_slot, reverse=True)

        for day, p in slots:
            # Constraints Check
            if not self._is_valid(cid, tid, sub, day, p, is_double, task):
                continue

            # Apply
            self._place(cid, tid, sub, day, p, is_double, task.get('teacher_name'))
            
            if self._backtrack(task_idx + 1):
                return True
            
            # Undo
            self._remove(cid, tid, day, p, is_double)

        return False

    def _is_valid(self, cid, tid, sub, day, p, is_double, task):
        # Basis slots
        ps = [p, p+1] if is_double else [p]
        
        for curr_p in ps:
            # 1. Class Slot Free
            if self.grid[cid][day][curr_p] is not None: return False
            # 2. Teacher Free
            if tid != -1 and self.teacher_busy[tid][day][curr_p]: return False
        
        # 3. Frequency & Variety Rule
        day_subjects = [self.grid[cid][day][pi]['subject'] for pi in range(self.periods_count) if self.grid[cid][day][pi]]
        periods_per_week = task.get('periods_per_week', 5)
        
        # If subject has 5 or fewer periods/week, it should ideally only appear ONCE per day
        # to ensure the students see a variety of subjects every day.
        if periods_per_week <= len(self.days):
            if sub in day_subjects: return False
        else:
            # If it must appear twice, enforce a GAP of at least 2 periods
            # (e.g. Hindi in P1, then Physics/Math/Eng, then Hindi in P4)
            # This prevents "Hindi, Hindi, Physics, Physics"
            if sub in day_subjects:
                # Find the existing period of this subject
                for pi in range(self.periods_count):
                    slot = self.grid[cid][day][pi]
                    if slot and slot['subject'] == sub:
                        if abs(pi - p) < 3: return False # Must have at least 2 slots gap

        # 4. Strict Adjacency (No AA)
        if p > 0:
            prev = self.grid[cid][day][p-1]
            if prev and prev['subject'] == sub: return False
        
        if is_double:
            if p < self.periods_count - 2:
                after = self.grid[cid][day][p+2]
                if after and after['subject'] == sub: return False
        else:
            if p < self.periods_count - 1:
                after = self.grid[cid][day][p+1]
                if after and after['subject'] == sub: return False

        return True

    def _place(self, cid, tid, sub, day, p, is_double, teacher_name):
        slots = [p, p+1] if is_double else [p]
        for curr_p in slots:
            self.grid[cid][day][curr_p] = {"subject": sub, "teacher_id": tid, "teacher_name": teacher_name}
            self.teacher_busy[tid][day][curr_p] = True

    def _remove(self, cid, tid, day, p, is_double):
        slots = [p, p+1] if is_double else [p]
        for curr_p in slots:
            self.grid[cid][day][curr_p] = None
            self.teacher_busy[tid][day][curr_p] = False
