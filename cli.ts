import readline from "readline"
import { type Task, createTodoList } from "./todo.ts"

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

const sortTasks = (displayTasks: Task[]): Task[] => {
    let sortedTasks = [...displayTasks].sort((a,b) => {
        if (a.name < b.name) return -1

        if (a.name > b.name) return 1

        return 0
    })

    return sortedTasks
}

const listTasks = (tasks: Task[], option?: string) => {
    let displayTasks = tasks

    if (option) {
        const splitOptions = option.split(/[ \t]+/)
        let i = 0
        let hasSortOption = false
        let hasStatusOption = false

        while (i < splitOptions.length) {
            if (splitOptions[i] == "--sort" && !hasSortOption) {
                if (splitOptions[i+1] == "name") {
                    displayTasks = sortTasks(displayTasks)

                } else {
                    console.log("Invalid command. Usage: list [--sort name] [--status pending|completed]")
                    return
                }

                hasSortOption = true
                i += 2

            } else if (splitOptions[i] == "--status" && !hasStatusOption) {
                if (splitOptions[i+1] == "pending") {
                    displayTasks = displayTasks.filter((task) => !task.isCompleted)

                } else if (splitOptions[i+1] == "completed") {
                    displayTasks = displayTasks.filter((task) => task.isCompleted)

                } else {
                    console.log("Invalid command. Usage: list [--sort name] [--status pending|completed]")
                    return
                }

                hasStatusOption = true
                i += 2

            } else {
                console.log("Invalid command. Usage: list [--sort name] [--status pending|completed]")
                return
            }
        }
    }

    if (displayTasks.length != 0) {
        for (let i = 0; i < displayTasks.length; i++) {
            const task = displayTasks[i];

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
            listTasks(tasks, argument)
            
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

