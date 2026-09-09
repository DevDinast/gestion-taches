export function getDueStatus(task) {
    if (task.is_done) return 'done';
    if (!task.due_date) return 'no-date';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(task.due_date);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate.getTime() < today.getTime()) return 'overdue';
    if (dueDate.getTime() === today.getTime()) return 'due-today';
    return 'upcoming';
}

export function formatDate(dateString) {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('fr-FR');
}