import readline from "readline"
import { type Task, type ListCommandOption, createTodoList } from "./todo.ts"

type Result<T> = {
    isSuccessful: true
    success: Success<T>
} | {
    isSuccessful: false
    error: Error
}

type Success<T> = {
    action: T
    todo?: Task
    todos?: Task[]
    id?: number
}

type Error = {
    code: "UNKNOWN_COMMAND"
    message: string
} | {
    code: "INVALID_COMMAND"
    message: string
} | {
    code: "TODO_NOT_FOUND"
    message: string
    id: number
}

const todos = createTodoList()
const tasks = todos.list()

const errorInvalidCommand = (usage: string): Error => {
    return {
        code: "INVALID_COMMAND", 
        message: `Invalid command. Usage: ${usage}`
    }
}

const errorTodoNotFound = (id: number): Error => {
    return {
        code: "TODO_NOT_FOUND",
        message: `Todo #${id} not found`,
        id: id
    }
}

const errorUnknownCommand = (): Error => {
    return {
        code: "UNKNOWN_COMMAND",
        message: `Unknown command. Type \"help\"`
    }
}

const handleCommand = (command: string, argument?: string): Result<"add"|"done"|"delete"|"list"|"help"|"exit"> => {
    if (command == "add") {
        if (!argument) {
            return  {
                isSuccessful: false,
                error: errorInvalidCommand("add <name>")
            }
        }

        const addedTask = todos.add(argument);

        if (addedTask == null) {
            return  {
                isSuccessful: false,
                error: errorInvalidCommand("add <name>")
            }

        } else {
            return {isSuccessful: true, success: {action: "add", todo: addedTask}}
        }

    } else if (command == "done") {
        if (!argument) {
            return  {
                isSuccessful: false,
                error:  errorInvalidCommand("done <id>")
            }
        }

        let taskId = parseId(argument)

        if (!taskId) {
            return {
                isSuccessful: false,
                error: errorInvalidCommand("done <id>")
            }
        }

        const completedTask = todos.done(taskId)

        if (completedTask == null) {
            return {
                isSuccessful: false,
                error: errorTodoNotFound(taskId)
            }

        } else {
            return {isSuccessful: true, success: {action: "done", id: completedTask.id}}
        }
    
    } else if (command == "delete") {
        if (!argument) {
            return {
                isSuccessful: false,
                error: errorInvalidCommand("delete <id>")
            }
        }

        let taskId = parseId(argument)

        if (!taskId) {
            return {
                isSuccessful: false,
                error: errorInvalidCommand("delete <id>")
            }
        }

        const deletedTask = todos.delete(taskId)

        if (deletedTask == null) {
            return {
                isSuccessful: false,
                error: errorTodoNotFound(taskId)
            }

        } else {
            return {isSuccessful: true, success: {action: "delete", id: deletedTask.id}}
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
                        return {
                            isSuccessful: false,
                            error: errorInvalidCommand("list [--sort name] [--status pending|completed]")
                        }
                    }

                    i += 2

                } else if (splitOptions[i] == "--status" && !option.status) {
                    if (splitOptions[i+1] == "pending") {
                        option.status = "pending"

                    } else if (splitOptions[i+1] == "completed") {
                        option.status = "completed"

                    } else {
                        return {
                            isSuccessful: false,
                            error: errorInvalidCommand("list [--sort name] [--status pending|completed]")
                        }
                    }

                    i += 2

                } else {
                    return {
                        isSuccessful: false,
                        error: errorInvalidCommand("list [--sort name] [--status pending|completed]")
                    }
                }
            }

            displayTasks = todos.list(option)
        }

        return {isSuccessful:true, success: {action:"list", todos: displayTasks}}

    } else if (command == "help") {
        if (argument) {
            return {
                isSuccessful: false,
                error: errorInvalidCommand("help")
            }
        }
        
        return {isSuccessful:true, success: {action:"help"}}

    } else if (command == "exit") {
        if (argument) {
            return {
                isSuccessful: false,
                error: errorInvalidCommand("exit")
            }
        }

        return {isSuccessful:true, success: {action:"exit"}}      

    } else {
        return {
            isSuccessful: false,
            error: errorUnknownCommand()
        }
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

const printText = (result: Result<"add"|"done"|"delete"|"list"|"help"|"exit">) => {
    if (result.isSuccessful) {
        if (result.success.todo) {
            const task = result.success.todo
            console.log(`Added #${task.id}: ${task.name}`)

        } else if (result.success.action == "done" && result.success.id) {
            const id = result.success.id
            console.log(`Completed #${id}`)

        } else if (result.success.action == "delete" && result.success.id) {
            const id = result.success.id
            console.log(`Deleted #${id}`)

        } else if (result.success.todos) {
            printOutTasks(result.success.todos)

        } else if (result.success.action == "help") {
            console.log(`    add <ชื่องาน>                       -> เพิ่มงานใหม่ แสดง id ที่ได้
    list                              -> แสดงงานทั้งหมด พร้อมสถานะ [ ] / [x]
    list [--sort name]                -> แสดงงานทั้งหมดที่เรียงด้วบชื่อ พร้อมสถานะ [ ] / [x]
    list [--status pending|completed] -> แสดงงานทั้งหมดที่มีสถานะเสร็จสิ้น หรือกำลังรอ พร้อมสถานะ [ ] / [x]
    done <id>                         -> ทําเครื่องหมายว่าเสร็จ
    delete <id>                       -> ลบงาน
    help                              -> แสดงรายการคําสั่ง
    exit                              -> ออกจากโปรแกรม`)
    
        } else if (result.success.action == "exit") {
            console.log(`Bye!`)
        }

    } else if (!result.isSuccessful) {
        console.log(result.error.message)
    }
}

const printJson = (result: Result<"add"|"done"|"delete"|"list"|"help"|"exit">) => {
    console.log(JSON.stringify(result))
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

    if (outputFormat == "text") {
        printText(result)
    } else if (outputFormat == "json") {
        printJson(result)
    }

    if (!result) {
        return

    } else if (result.isSuccessful && result.success.action == "exit") {
        process.stdin.unref()
        isExited = true
    }
})

