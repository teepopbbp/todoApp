import readline from "readline"
import { type Task, type ListOption, createTodoList } from "./todo.ts"

let isExited = false

const todos = createTodoList()

const parseId = (argument: string): number | null => {
    let allowArgs = /^[0-9]+$/
    const idMatch = argument.match(allowArgs)

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

const rl = readline.createInterface (
    {
        input: process.stdin,
    }
)

rl.on('line', (rawLine: string) => {
    const line = rawLine.trim()
    
    const match = line.match(/^(\S+)(?:[ \t]+([\s\S]*))?$/)

    if (match == null) {
        return
    }

    const command = match[1]
    const argument = match[2]

    const tasks = todos.list()

    if (isExited == true) {
        return

    } else if (command == "add") {
        let taskName = argument

        if (!taskName) {
            console.log("Invalid command. Usage: add <name>")

        } else {
            todos.add(taskName);
            const taskId = tasks[tasks.length - 1].id

            console.log(`Added #${taskId}: ${taskName}`)
        }

    } else if (command == "done") {
        if (!argument) {
            console.log("Invalid command. Usage: done <id>")
            return
        }

        let argumentSplit = argument.split(/[ \t]+/)

        if (argumentSplit.length != 1) {
            console.log("Invalid command. Usage: done <id>")
            return
        }

        let taskId = parseId(argumentSplit[0])

        if (!taskId) {
            console.log("Invalid command. Usage: done <id>")

        } else if (!isNaN(taskId)) {
            let index = tasks.findIndex((task) => task.id == taskId)

            if (index >= 0) {
                todos.done(taskId)

                console.log(`Completed #${taskId}`)

            } else {
                console.log(`Todo #${taskId} not found`)
            }

        } else {
            console.log(`Unknown command. Type "help"`)
        }
        
    } else if (command == "delete") {
        if (!argument) {
            console.log("Invalid command. Usage: delete <id>")
            return
        }

        let argumentSplit = argument.split(/[ \t]+/)

        if (argumentSplit.length != 1) {
            console.log("Invalid command. Usage: delete <id>")
            return
        }

        let taskId = parseId(argumentSplit[0])

        if (!taskId) {
            console.log("Invalid command. Usage: delete <id>")

        } else if (!isNaN(taskId)) {
            let index = tasks.findIndex((task) => task.id == taskId)
            
            if (index >= 0) {
                todos.delete(taskId)

                console.log(`Deleted #${taskId}`)

            } else {
                console.log(`Todo #${taskId} not found`)
            }

        } else {
            console.log(`Unknown command. Type "help"`)
        }

    } else if (command == "list") {
        if (tasks.length != 0) {
            let displayTasks = tasks

            if (argument) {
                let option: ListOption = {}

                const splitOptions = argument.split(/[ \t]+/)
                let i = 0

                while (i < splitOptions.length) {
                    if (splitOptions[i] == "--sort"  && option.sort != "name") {
                        if (splitOptions[i+1] == "name") {
                            option.sort = "name"

                        } else {
                            console.log("Invalid command. Usage: list [--sort name] [--status pending|completed]")
                            return
                        }

                        i += 2

                    } else if (splitOptions[i] == "--status" && !option.status) {
                        if (splitOptions[i+1] == "pending") {
                            option.status = "pending"

                        } else if (splitOptions[i+1] == "completed") {
                            option.status = "completed"

                        } else {
                            console.log("Invalid command. Usage: list [--sort name] [--status pending|completed]")
                            return
                        }

                        i += 2

                    } else {
                        console.log("Invalid command. Usage: list [--sort name] [--status pending|completed]")
                        return
                    }
                }

                displayTasks = todos.list(option)
            }

            printOutTasks(displayTasks)
            
        } else {
            console.log("No todos")
        }

    } else if (command == "help") {
        if (argument) {
            console.log("Invalid command. Usage: help")
            return
        }

        console.log(`    add <ชื่องาน>                       -> เพิ่มงานใหม่ แสดง id ที่ได้
    list                              -> แสดงงานทั้งหมด พร้อมสถานะ [ ] / [x]
    list [--sort name]                -> แสดงงานทั้งหมดที่เรียงด้วบชื่อ พร้อมสถานะ [ ] / [x]
    list [--status pending|completed] -> แสดงงานทั้งหมดที่มีสถานะเสร็จสิ้น หรือกำลังรอ พร้อมสถานะ [ ] / [x]
    done <id>                         -> ทําเครื่องหมายว่าเสร็จ
    delete <id>                       -> ลบงาน
    help                              -> แสดงรายการคําสั่ง
    exit                              -> ออกจากโปรแกรม`)

    } else if (command == "exit") {
        if (argument) {
            console.log("Invalid command. Usage: exit")
            return
        }

        console.log(`Bye!`)
        process.stdin.unref()
        isExited = true
        
    } else {
        console.log(`Unknown command. Type "help"`)
    }
})

