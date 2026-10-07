export type Task = {
    id: number
    name: string
    isCompleted : boolean
}

export type ListOption = {
    sort?: "name"
    status?: "pending" | "completed"
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

const sortTasks = (displayTasks: Task[]) => {
    let sortedTasks = [...displayTasks].sort((a,b) => {
        if (a.name < b.name) return -1

        if (a.name > b.name) return 1

        return 0
    })

    return sortedTasks
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

    const remove = (taskId: number) => {
        let index = tasks.findIndex((task) => task.id == taskId)

        if (index >= 0) {
            return deleteTask(tasks, index)

        } else {
            return
        }
    }
    
    const list = (options?: ListOption) => {
        let displayTasks = tasks
        
        if (options) {
            if (options.status == "pending") {
                displayTasks = displayTasks.filter((task) => !task.isCompleted)

            } else if (options.status == "completed") {
                displayTasks = displayTasks.filter((task) => task.isCompleted)
            }

            if (options?.sort == "name") {
                displayTasks = sortTasks(displayTasks)
            }
        }

        return displayTasks
    }

    return {add, done, delete: remove, list}
}

