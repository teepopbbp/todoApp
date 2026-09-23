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

const list = (tasks: Task[]) => {
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        
        if (task != undefined){
            if (!task.isCompleted) {
                console.log(`[ ] ${task.id}. ${task.name}`)

            } else {
                console.log(`[x] ${task.id}. ${task.name}`)
            }
        }   
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
        let argumentSplit = argument.split(/[ \t]+/)

        if (argumentSplit.length != 1) {
            console.log("Invalid command. Usage: done <id>")
            return
        }

        let taskId = parseInt(argumentSplit[0])

        if (!taskId) {
            console.log("Invalid command. Usage: done <id>")

        } else if (!isNaN(taskId)) {
            let index = tasks.findIndex((task) => task.id == taskId)

            if (index >= 0) {
                completeTask(tasks, index)

                console.log(`Completed # ${taskId}`)

            } else {
                console.log(`Todo #${taskId} not found`)
            }

        } else {
            console.log(`Unknown command. Type "help"`)
        }
        
    } else if (command == "delete") {
        let argumentSplit = argument.split(/[ \t]+/)

        if (argumentSplit.length != 1) {
            console.log("Invalid command. Usage: delete <id>")
            return
        }

        let taskId = parseInt(argumentSplit[0])

        if (!taskId) {
            console.log("Invalid command. Usage: delete <id>")

        } else if (!isNaN(taskId)) {
            let index = tasks.findIndex((task) => task.id == taskId)
            
            if (index >= 0) {
                deleteTask(tasks, index)

                console.log(`Deleted # ${taskId}`)

            } else {
                console.log(`Todo #${taskId} not found`)
            }

        } else {
            console.log(`Unknown command. Type "help"`)
        }

    } else if (command == "list") {
        if (tasks.length != 0) {
            list(tasks)
            
        } else {
            console.log("No todos")
        }

    } else if (command == "help") {
        console.log(`add <ชื่องาน> -> เพิ่มงานใหม่ แสดง id ที่ได้`)
        console.log(`list        -> แสดงงานทั้งหมด พร้อมสถานะ [ ] / [x]`)
        console.log(`done <id>   -> ทําเครื่องหมายว่าเสร็จ`)
        console.log(`delete <id> -> ลบงาน`)
        console.log(`help        -> แสดงรายการคําสั่ง`)
        console.log(`exit        -> ออกจากโปรแกรม`)

    } else if (command == "exit") {
        console.log(`Bye!`)
        process.stdin.unref()
        isExited = true
        
    } else {
        console.log(`Unknown command. Type "help"`)
    }
})


