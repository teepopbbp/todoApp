export type Task = {
    id: number
    name: string
    isCompleted : boolean
}

export type ListCommandOption = {
    sort?: "name"
    status?: "pending" | "completed"
}

export type Result<T> = {
    isSuccessful: true
    value: T
} | {
    isSuccessful: false
    error: Error
}

export type Error = {
    code: "INVALID_COMMAND" | "TODO_NOT_FOUND" | "UNKNOWN_COMMAND"
    message: string
    id?: number
}

export const errorInvalidCommand = (usage: string): Error => {
    return {
        code: "INVALID_COMMAND", 
        message: `Invalid command. Usage: ${usage}`
    }
}

export const errorTodoNotFound = (id: number): Error => {
    return {
        code: "TODO_NOT_FOUND",
        message: `Todo #${id} not found`,
        id: id
    }
}

export const errorUnknownCommand = (): Error => {
    return {
        code: "UNKNOWN_COMMAND",
        message: `Unknown command. Type \"help\"`
    }
}

export interface TodoList {
    add: (taskName: string) => Result<Task>
    done: (taskId: number) => Result<number>
    delete: (taskId: number) => Result<number>
    list: (options?: ListCommandOption) =>Task[]
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

    const add = (taskName: string): Result<Task> => {
        const trimmedTaskName = taskName.trim()

        if (trimmedTaskName === "") {
            return {
                isSuccessful: false,
                error: errorInvalidCommand("add <name>")
            }
        }

        const task: Task = {
            id: idTrack++,
            name: trimmedTaskName,
            isCompleted: false
        }
        
        tasks.push(task)

        return {
            isSuccessful: true,
            value: task
        }
    }

    const done = (taskId: number): Result<number> => {
        if (!taskId) {
            return {
                isSuccessful: false,
                error: errorInvalidCommand("done <id>")
            }
        }

        let index = tasks.findIndex((task) => task.id == taskId)

        if (index >= 0) {
            tasks[index].isCompleted = true
            return {
                isSuccessful: true,
                value: taskId
            }

        } else {
            return {
                isSuccessful: false,
                error: errorTodoNotFound(taskId)
            }
        }
    }

    const remove = (taskId: number): Result<number> => {
         if (!taskId) {
            return {
                isSuccessful: false,
                error: errorInvalidCommand("delete <id>")
            }
        }

        let index = tasks.findIndex((task) => task.id == taskId)

        if (index >= 0) {
            tasks.splice(index, 1)
            return {
                isSuccessful: true,
                value: taskId
            }

        } else {
            return {
                isSuccessful: false,
                error: errorTodoNotFound(taskId)
            }
        }
    }
    
    const list = (options?: ListCommandOption): Task[] => {
        let displayTasks = tasks

        if (options) {
            if (options.status == "pending") {
                displayTasks = displayTasks.filter((task) => !task.isCompleted)

            } else if (options.status == "completed") {
                displayTasks = displayTasks.filter((task) => task.isCompleted)
            }

            if (options.sort == "name") {
                displayTasks = sortTasks(displayTasks)
            }
        }

        return displayTasks
    }

    return {add, done, delete: remove, list}
}

