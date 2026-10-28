import {type Task, type Error} from "./todo.ts"

export type OutputFormat = "text" | "json"

export class CLIPresenter {
    added(task: Task): string {
        return `Added #${task.id}: ${task.name}`
    }

    completed(id: number): string {
        return `Completed #${id}`
    }
 
    deleted(id: number): string {
        return `Deleted #${id}`
    }

    listed(tasks: Task[]): string {
        if (tasks.length == 0) {
            return "No todos"
        }
 
        return tasks
            .map((task) => `[${task.isCompleted ? "x" : " "}] ${task.id}. ${task.name}`)
            .join("\n")
    }
 
    helped(): string {
        return `    add <ชื่องาน>                       -> เพิ่มงานใหม่ แสดง id ที่ได้
    list                              -> แสดงงานทั้งหมด พร้อมสถานะ [ ] / [x]
    list [--sort name]                -> แสดงงานทั้งหมดที่เรียงด้วยชื่อ พร้อมสถานะ [ ] / [x]
    list [--status pending|completed] -> แสดงงานทั้งหมดที่มีสถานะเสร็จสิ้น หรือกำลังรอ พร้อมสถานะ [ ] / [x]
    done <id>                         -> ทําเครื่องหมายว่าเสร็จ
    delete <id>                       -> ลบงาน
    help                              -> แสดงรายการคําสั่ง
    exit                              -> ออกจากโปรแกรม`
    }
 
    exited(): string {
        return "Bye!"
    }

    error(error: Error): string {
        return error.message
    }
}

const success = (action: string, data?: object): string => {
    return JSON.stringify({ isSuccessful: true, action, ...data })
}

export class JSONPresenter {
    added(task: Task): string {
        return success("add", { todo: task })
    }
 
    listed(tasks: Task[]): string {
        return success("list", { todos: tasks })
    }
 
    completed(id: number): string {
        return success("done", { id })
    }
 
    deleted(id: number): string {
        return success("delete", { id })
    }
 
    helped(): string {
        return success("help", { 
            commands: [
                "add <name>", "list [--sort name] [--status pending|completed]", "done <id>", "delete <id>", "help", "exit"
            ], 
            outputModes: ["text","json"] })
    }
 
    exited(): string {
        return success("exit")
    }
 
    error(error: Error): string {
        return JSON.stringify({ isSuccessful: false, error })
    }
}

export const createPresenter = (format: OutputFormat): CLIPresenter | JSONPresenter => {
    if (format == "json") {
        return new JSONPresenter()
    }

    return new CLIPresenter()
}