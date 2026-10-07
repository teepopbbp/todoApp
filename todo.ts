export type Task = {
    id: number
    name: string
    isCompleted : boolean
}

const addTask = (tasks: Task[], taskName: string, idTrack: number) => {
    tasks.push(
        {
            id: idTrack,
            name: taskName,
            isCompleted: false
        }   
    )
}

const completeTask = (tasks: Task[], index: number) => {
    tasks[index].isCompleted = true
}

const deleteTask = (tasks: Task[], index: number) => {
    tasks.splice(index, 1)
}

export const createTodoList = () => {
    let tasks:Task[] = []

    let idTrack = 1

    const add = (taskName: string) => {
        const trimmedTaskName = taskName.trim()

        if (trimmedTaskName === "") {
            return null
        }

        return addTask(tasks, trimmedTaskName, idTrack++)
    }

    const done = (taskId: number) => {
        let index = tasks.findIndex((task) => task.id == taskId)

        if (index >= 0) {
            completeTask(tasks, index)

        } else {
            return
        }
    }

    const remove = (id: number) => {
        return deleteTask(tasks, id - 1)
    }

    const list = () => {
        return tasks
    }

    return {add, done, delete: remove, list}
}

