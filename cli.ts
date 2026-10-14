import readline from "readline"
import { type Task, type ListCommandOption, createTodoList } from "./todo.ts"

type SuccessResult = {
    isSuccessful: true
    action: "add" | "list" | "done" | "delete" | "help" | "exit"
    todo?: Task
    todos?: Task[]
    id?: number
}

type ErrorResult = {
    isSuccessful: false
    error: {
        code: "UNKNOWN_COMMAND" | "INVALID_COMMAND" | "TODO_NOT_FOUND"
        message: string
        id?: number
    }
}

type Result = SuccessResult | ErrorResult

const todos = createTodoList()
const tasks = todos.list()

const handleCommand = (command: string, argument?: string): Result | null => {
    if (command == "add") {
        if (!argument) {
            console.log("Invalid command. Usage: add <name>")
            return null
        }

        const addedTask = todos.add(argument);

        if (addedTask == null) {
            console.log("Invalid command. Usage: add <name>")
            return null

        } else {
            return {isSuccessful: true, action:"add", todo: addedTask}
        }

    } else if (command = "done") {
        if (!argument) {
            console.log("Invalid command. Usage: done <id>")
            return null
        }

        let taskId = parseId(argument)

        if (!taskId) {
            console.log("Invalid command. Usage: done <id>")
            return null
        }

        const completedTask = todos.done(taskId)

        if (completedTask == null) {
            console.log(`Todo #${taskId} not found`)
            return null

        } else {
            return {isSuccessful: true, action:"done",id: completedTask.id}
        }
    
    } else if (command == "delete") {
        if (!argument) {
            console.log("Invalid command. Usage: delete <id>")
            return null
        }

        let taskId = parseId(argument)

        if (!taskId) {
            console.log("Invalid command. Usage: delete <id>")
            return null
        }

        const deletedTask = todos.done(taskId)

        if (deletedTask == null) {
            console.log(`Todo #${taskId} not found`)
            return null

        } else {
            return {isSuccessful: true, action:"delete",id: deletedTask.id}
        }

    } else if (command == "list") {
        let displayTasks = tasks

        if (argument) {
            let option: ListCommandOption = {}

            const splitOptions = argument.split(/[ \t]+/)
            let i = 0

            while (i < splitOptions.length) {
                if (splitOptions[i] == "--sort"  && option.sort != "name") {
                    if (splitOptions[i+1] == "name") {
                        option.sort = "name"

                    } else {
                        console.log("Invalid command. Usage: list [--sort name] [--status pending|completed]")
                        return null
                    }

                    i += 2

                } else if (splitOptions[i] == "--status" && !option.status) {
                    if (splitOptions[i+1] == "pending") {
                        option.status = "pending"

                    } else if (splitOptions[i+1] == "completed") {
                        option.status = "completed"

                    } else {
                        console.log("Invalid command. Usage: list [--sort name] [--status pending|completed]")
                        return null
                    }

                    i += 2

                } else {
                    console.log("Invalid command. Usage: list [--sort name] [--status pending|completed]")
                    return null
                }
            }

            displayTasks = todos.list(option)
        }

        return {isSuccessful:true, action:"list", todos: displayTasks}

    } else if (command == "help") {
        if (argument) {
            console.log("Invalid command. Usage: help")
            return null
        }
        
        return {isSuccessful:true, action:"help"}

    } else if (command == "exit") {
        if (argument) {
            console.log("Invalid command. Usage: exit")
            return null
        }

        return {isSuccessful:true, action:"exit"}        

    } else {
        console.log(`Unknown command. Type "help"`)
        return null
    }
}

const parseId = (argument: string): number | null => {
    let allowedArgs = /^[0-9]+$/
    const idMatch = argument.match(allowedArgs)

    const id = parseInt(argument)

    if (idMatch == null) {
        return null
    }

    if (id <= 0 || id > Number.MAX_SAFE_INTEGER){
        return null
    }

    return id
}

const printOutTasks = (tasks: Task[]) => {
    if (tasks.length != 0) {
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];

            if (!task.isCompleted) {
                console.log(`[ ] ${task.id}. ${task.name}`)

            } else {
                console.log(`[x] ${task.id}. ${task.name}`)
            }
        }

    } else {
        console.log("No todos")
    }
}

const parseOutputFormat = (argument:string[]) => {
    if (argument.length == 0) {
        return "text"
    }

    if (argument[0] == "--output" && (
        argument[1] == "text" || argument[1] == "json")) {
        return argument[1]
        
    } else {
        return null
    }
}

const outputArguments = process.argv.slice(2)

const outputFormat = parseOutputFormat(outputArguments)

if (outputFormat == null) {
    process.exit()
}

const rl = readline.createInterface (
    {
        input: process.stdin,
    }
)

let isExited = false

rl.on('line', (rawLine: string) => {
    if (isExited == true) {
            return
    }

    const line = rawLine.trim()
    
    const match = line.match(/^(\S+)(?:[ \t]+([\s\S]*))?$/)

    if (match == null) {
        return
    }

    const command = match[1]
    const argument = match[2]

    const result = handleCommand(command, argument)

    if (!result) {
        return

    } else if (result.isSuccessful && result.action == "exit") {
        process.stdin.unref()
        isExited = true
    }
})

