<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Services\TaskServices;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function __construct(private TaskServices $taskServices)
    {}

    // GET /dashboard — stats uniquement
    public function index()
    {
        $tasks = $this->taskServices->index();

        return Inertia::render('Tasks/Dashboard', [
            'tasks' => $tasks
        ]);
    }

    // GET /tasks — liste complète et filtrable
    public function list()
    {
        $tasks = $this->taskServices->index();

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks
        ]);
    }

    public function show(Task $tasks)
    {
        return Inertia::render('Tasks/Show', [
            'tasks' => $tasks
        ]);
    }

    public function create()
    {
        return Inertia::render('Tasks/Create');
    }

    public function store(Request $request)
    {
        $this->taskServices->create($request);

        return redirect()->route('tasks.index')
            ->with('message', 'Tâche créée avec succès !');
    }

    public function edit(Task $tasks)
    {
        $this->authorize('update', $tasks);

        return Inertia::render('Tasks/Edit', [
            'tasks' => $tasks
        ]);
    }

    public function update(Request $request, Task $tasks)
    {
        $this->authorize('update', $tasks);

        $this->taskServices->update($request, $tasks);

        return back()->with('message', 'Tâche mise à jour avec succès !');
    }

    public function destroy(Task $tasks)
    {
        $this->authorize('delete', $tasks);

        $this->taskServices->destroy($tasks);

        return redirect()->route('tasks.index')
            ->with('message', 'Tâche supprimée avec succès !');
    }
}