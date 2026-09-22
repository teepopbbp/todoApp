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

rl.on('line', (line: string) => {
    if (isExited == true) {
        return

    } else if (line.startsWith("add ")) {
        let taskName: string = line.slice(4)

        if (taskName == "") {
            console.log("error, nothing add")

        } else {
            addTask(tasks, taskName);
        
            console.log(`Added #${idTrack}: ${taskName}`)
            idTrack++
        }

    } else if (line.startsWith("done ")) {
        let taskId: number = parseFloat(line.slice(4))

        if (!isNaN(taskId)) {
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
        
    } else if (line.startsWith("delete ")) {
        let taskId: number = parseFloat(line.slice(6))

        if (!isNaN(taskId)) {
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

    } else if (line == "list") {
        if (tasks.length != 0) {
            list(tasks)
            
        } else {
            console.log("No todos")
        }

    } else if (line == "help") {
        console.log(`add <ชื่องาน> -> เพิ่มงานใหม่ แสดง id ที่ได้`)
        console.log(`list        -> แสดงงานทั้งหมด พร้อมสถานะ [ ] / [x]`)
        console.log(`done <id>   -> ทําเครื่องหมายว่าเสร็จ`)
        console.log(`delete <id> -> ลบงาน`)
        console.log(`help        -> แสดงรายการคําสั่ง`)
        console.log(`exit        -> ออกจากโปรแกรม`)

    } else if (line == "exit" || line.startsWith("exit ")) {
        console.log(`Bye!`)
        process.stdin.unref()
        isExited = true
        
    } else {
        console.log(`Unknown command. Type "help"`)
    }
})


