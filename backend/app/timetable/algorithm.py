import random
from typing import List, Dict, Any, Optional

class TimetableGenerator:
    def __init__(self, days: List[str], periods: int, workloads: List[Dict[str, Any]], drill_periods: List[Dict[str, Any]] = None, class_teachers: Dict[int, int] = None, teacher_constraints: Dict[int, List[Dict[str, Any]]] = None):
        """
        workloads: List of { "class_id": int, "subject_name": str, "teacher_id": int, "teacher_name": str, "periods_per_week": int }
        drill_periods: List of { "day": str, "period": int }
        class_teachers: Dict of { class_id: teacher_id }
        teacher_constraints: Dict of { teacher_id: List of { "day": str, "period": int } }
        """
        self.days = days
        self.periods_count = periods
        self.workloads = workloads
        self.drill_periods = drill_periods or []
        self.class_teachers = class_teachers or {}
        self.teacher_constraints = teacher_constraints or {}
        
        self.grid = {}
        self.teacher_busy = {}
        
        self.class_ids = list(set(w['class_id'] for w in workloads))
        self.teacher_ids = list(set(w['teacher_id'] for w in workloads))
        
        for cid in self.class_ids:
            self.grid[cid] = {day: [None] * self.periods_count for day in self.days}
            
        for tid in self.teacher_ids:
            self.teacher_busy[tid] = {day: [False] * self.periods_count for day in self.days}

        # 1. Pre-apply Drill Periods (Fixed Hard Constraint)
        for dp in self.drill_periods:
            p_idx = dp['period'] - 1
            if dp['day'] in self.days and 0 <= p_idx < self.periods_count:
                for cid in self.class_ids:
                    self.grid[cid][dp['day']][p_idx] = {"subject": "Mass Drill", "teacher_id": -1, "teacher_name": "All Staff"}

        # 2. Pre-apply Teacher Unavailability (Fixed Hard Constraint)
        for tid, constraints in self.teacher_constraints.items():
            if tid in self.teacher_busy:
                for cons in constraints:
                    p_idx = cons['period'] - 1
                    if cons['day'] in self.days and 0 <= p_idx < self.periods_count:
                        self.teacher_busy[tid][cons['day']][p_idx] = True

        # 3. Handle First Period = Class Teacher (Strategy: Move tasks to 1st period)
        self.remaining_tasks = []
        for w in self.workloads:
            # We will handle these dynamically inside backtrack to maintain flexibility
            # but we prioritize them
            for _ in range(w['periods_per_week']):
                self.remaining_tasks.append({
                    "class_id": w['class_id'],
                    "subject": w['subject_name'],
                    "teacher_id": w['teacher_id'],
                    "teacher_name": w.get('teacher_name', 'Unknown')
                })

    def generate(self) -> Optional[Dict[int, Any]]:
        # Sort tasks: Prioritize Class Teacher tasks for Period 1
        # MRV Heuristic: Workloads with many periods first
        self.remaining_tasks.sort(key=lambda x: x['class_id']) # Group by class
        
        if self._backtrack(0):
            return self.grid
        return None

    def _backtrack(self, task_idx):
        if task_idx == len(self.remaining_tasks):
            return True

        task = self.remaining_tasks[task_idx]
        cid = task['class_id']
        tid = task['teacher_id']
        sub = task['subject']
        
        # Determine valid slots for this specific task
        slots = []
        for day in self.days:
            for p in range(self.periods_count):
                slots.append((day, p))
        
        # Optimization: If this is the class teacher and we are filling a 1st period, try that first
        is_class_teacher = self.class_teachers.get(cid) == tid
        
        def slot_priority(slot):
            day, p = slot
            # Rule 3: First period MUST be class teacher
            if p == 0:
                if is_class_teacher: return 0 # Highest priority
                else: return 100 # Forbidden for others
            return 50 # Middle priority

        slots.sort(key=slot_priority)
        # random.shuffle(slots) # Only shuffle same-priority slots to avoid bias

        for day, p in slots:
            # Skip if priority is forbidden (Rule 3)
            if p == 0 and not is_class_teacher:
                continue
            # Also, if p == 0 and is_class_teacher, but class teacher is ALREADY assigned to another class's p0?
            # That's handled by teacher_busy check.

            # Hard Constraint 1: Class Slot free
            if self.grid[cid][day][p] is not None:
                continue
            
            # Hard Constraint 2: Teacher free
            if self.teacher_busy[tid][day][p]:
                continue

            # Rule 2: Max 2 times same subject per day per class
            day_subjects = [self.grid[cid][day][p_tmp]['subject'] for p_tmp in range(self.periods_count) if self.grid[cid][day][p_tmp]]
            if day_subjects.count(sub) >= 2:
                continue

            # Place assignment
            self.grid[cid][day][p] = {"subject": sub, "teacher_id": tid, "teacher_name": task['teacher_name']}
            self.teacher_busy[tid][day][p] = True

            if self._backtrack(task_idx + 1):
                return True

            # Undo
            self.grid[cid][day][p] = None
            self.teacher_busy[tid][day][p] = False

        return False
