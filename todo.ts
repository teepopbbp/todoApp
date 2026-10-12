export type Task = {
    id: number
    name: string
    isCompleted : boolean
}

export type ListOption = {
    sort?: "name"
    status?: "pending" | "completed"
}

interface TodoList {
    add: (taskName: string) => Task | null
    done: (taskId: number) => Task | null
    delete: (taskId: number) => Task | null
    list: (options?: ListOption) => Task[]
}

const sortTasks = (displayTasks: Task[]): Task[] => {
    let sortedTasks = [...displayTasks].sort((a,b) => {
        if (a.name < b.name) return -1

        if (a.name > b.name) return 1

        return 0
    })

    return sortedTasks
}

export const createTodoList = (): TodoList => {
    let tasks:Task[] = []

    let idTrack = 1

    const add = (taskName: string): Task | null => {
        const trimmedTaskName = taskName.trim()

        if (trimmedTaskName === "") {
            return null
        }

        const task: Task = {
            id: idTrack++,
            name: trimmedTaskName,
            isCompleted: false
        }
        
        tasks.push(task)
        return task
    }

    const done = (taskId: number): Task | null => {
        let index = tasks.findIndex((task) => task.id == taskId)

        if (index >= 0) {
            tasks[index].isCompleted = true
            return tasks[index]

        } else {
            return null
        }
    }

    const remove = (taskId: number): Task | null => {
        let index = tasks.findIndex((task) => task.id == taskId)

        if (index >= 0) {
            return tasks.splice(index, 1)[0]

        } else {
            return null
        }
    }
    
    const list = (options?: ListOption): Task[] => {
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

