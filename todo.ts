import readline from "readline"

type Task = {
    name: string
    id: number
    isCompleted : boolean
}

let tasks: Task[] = []

let idTrack = 1

let isExited = false

const addTask = (tasks: Task[], taskName: string) => {
    tasks.push(
        {
            name: taskName,
            id: idTrack,
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

const sortList = (displayTasks: Task[]) => {
    let sortTasks = [...displayTasks].sort((a,b) => {
        if (a.name < b.name) return -1

        if (a.name > b.name) return 1

        return 0
    })

    return sortTasks
}

const listTask = (tasks: Task[], option?: string) => {
    let displayTasks = tasks

    if (option) {
        const optionSplit = option.split(/[ \t]+/)
        let i = 0
        let hasSorted = false
        let hasStatus = false

        while (i < optionSplit.length) {
            if (optionSplit[i] == "--sort" && !hasSorted) {
                if (optionSplit[i+1] == "name") {
                    displayTasks = sortList(displayTasks)

                } else {
                    console.log("Invalid command. Usage: list [--sort name] [--status pending|completed]")
                    return
                }

                hasSorted = true
                i += 2

            } else if (optionSplit[i] == "--status" && !hasStatus) {
                if (optionSplit[i+1] == "pending") {
                    displayTasks = displayTasks.filter((task) => !task.isCompleted)

                } else if (optionSplit[i+1] == "completed") {
                    displayTasks = displayTasks.filter((task) => task.isCompleted)

                } else {
                    console.log("Invalid command. Usage: list [--sort name] [--status pending|completed]")
                    return
                }

                hasStatus = true
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

const parseId = (argument: string) => {
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

    if (isExited == true) {
        return

    } else if (command == "add") {
        let taskName = argument

        if (!taskName) {
            console.log("Invalid command. Usage: add <name>")

        } else {
            addTask(tasks, taskName);
        
            console.log(`Added #${idTrack}: ${taskName}`)
            idTrack++
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
                completeTask(tasks, index)

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
                deleteTask(tasks, index)

                console.log(`Deleted #${taskId}`)

            } else {
                console.log(`Todo #${taskId} not found`)
            }

        } else {
            console.log(`Unknown command. Type "help"`)
        }

    } else if (command == "list") {
        if (tasks.length != 0) {
            listTask(tasks, argument)
            
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


