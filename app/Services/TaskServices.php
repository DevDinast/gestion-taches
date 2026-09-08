<?php

namespace App\Services;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Task;

class TaskServices
{
    public function index()
    {
        return Task::where('user_id', Auth::id())->get();
    }

    public function create(Request $request)
    {
        $task = Task::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'description' => $request->description,
            'due_date' => $request->due_date,
            'is_done' => $request->boolean('is_done'),
            
        ]);

        return $task;
    }

    public function update(Request $request, Task $task)
    {
        $task->update([
            'title' => $request->title,
            'description' => $request->description,
            'due_date' => $request->due_date,
            'is_done' => $request->boolean('is_done'),
        ]);

        return $task;
    }

    public function destroy(Task $task)
    {
        $task->delete();

        return $task;
    }
}