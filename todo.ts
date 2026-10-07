export type Task = {
    id: number
    name: string
    isCompleted : boolean
}

export type ListOption = {
    sort?: "name"
    status?: "pending" | "completed"
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
            return
        }

        tasks.push (
            {
                id: idTrack++,
                name: trimmedTaskName,
                isCompleted: false
            }   
        )
    }

    const done = (taskId: number) => {
        let index = tasks.findIndex((task) => task.id == taskId)

        if (index >= 0) {
            tasks[index].isCompleted = true

        } else {
            return
        }
    }

    const remove = (taskId: number) => {
        let index = tasks.findIndex((task) => task.id == taskId)

        if (index >= 0) {
            tasks.splice(index, 1)

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

