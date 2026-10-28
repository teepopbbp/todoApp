import readline from "readline"
import { type TodoList, createTodoList, errorInvalidCommand, errorUnknownCommand, type ListCommandOption } from "./todo.ts"
import { type OutputFormat, createPresenter, CLIPresenter, JSONPresenter} from "./presenter.ts"

const handleConsoleCommand = (
    todos: TodoList, presenter: CLIPresenter | JSONPresenter , command: string, argument?: string): string => {
    if (command == "add") {
        if (!argument) {
            return presenter.error(errorInvalidCommand("add <name>"))
        }

        const addedTask = todos.add(argument)

        if (addedTask.isSuccessful) {
            return presenter.added(addedTask.value)

        } else {
            return presenter.error(addedTask.error)
        }

    } else if (command == "done") {
        if (!argument) {
            return presenter.error(errorInvalidCommand("done <id>"))
        }

        const taskId = parseId(argument)

        if (!taskId) {
            return presenter.error(errorInvalidCommand("done <id>"))
        }

        const completedTask = todos.done(taskId)

        if (completedTask.isSuccessful) {
            return presenter.completed(taskId)

        } else {
            return presenter.error(completedTask.error)
        }
    
    } else if (command == "delete") {
        if (!argument) {
            return presenter.error(errorInvalidCommand("delete <id>"))
        }

        const taskId = parseId(argument)

        if (!taskId) {
            return presenter.error(errorInvalidCommand("delete <id>"))
        }

        const deletedTask = todos.delete(taskId)

        if (deletedTask.isSuccessful) {
            return presenter.deleted(taskId)

        } else {
            return presenter.error(deletedTask.error)
        }

    } else if (command == "list") {
        let option: ListCommandOption = {}

        if (argument) {
            const splitOptions = argument.split(/[ \t]+/)
            let i = 0

            while (i < splitOptions.length) {
                if (splitOptions[i] == "--sort"  && option.sort != "name") {
                    if (splitOptions[i+1] == "name") {
                        option.sort = "name"

                    } else {
                        return presenter.error(
                            errorInvalidCommand("list [--sort name] [--status pending|completed]")
                        )
                    }

                    i += 2

                } else if (splitOptions[i] == "--status" && !option.status) {
                    if (splitOptions[i+1] == "pending") {
                        option.status = "pending"

                    } else if (splitOptions[i+1] == "completed") {
                        option.status = "completed"

                    } else {
                        return presenter.error(
                            errorInvalidCommand("list [--sort name] [--status pending|completed]")
                        )
                    }

                    i += 2

                } else {
                    return presenter.error(
                            errorInvalidCommand("list [--sort name] [--status pending|completed]")
                    )
                }
            }
        }

        const displayTasks = todos.list(option)

        return presenter.listed(displayTasks)
        
    } else if (command == "help") {
        if (argument) {
            return presenter.error(errorInvalidCommand("help"))
        }
        
        return presenter.helped()

    } else if (command == "exit") {
        if (argument) {
            return presenter.error(errorInvalidCommand("exit"))
        }

        return presenter.exited()

    } else {
        return presenter.error(errorUnknownCommand())
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

const parseOutputFormat = (argument:string[]): OutputFormat | null => {
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

const todos = createTodoList()
const presenter = createPresenter(outputFormat)

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

    const result = handleConsoleCommand(todos, presenter, command, argument)
    console.log(result)

    if (!result) {
        return

    } else if (result == presenter.exited()) {
        process.stdin.unref()
        isExited = true
    }
})

