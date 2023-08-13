import { Component, CrossBuild, OptionsHandler, ReceivedInteraction } from "@crossbuild/core"

export default class Cmd extends Component {
    constructor(client: CrossBuild) {
        super("argstest", "command", client, {
            description: "Test argument parsing",
            options: [
                {
                    type: "string",
                    name: "short-string",
                    description: "A string shorter than 20 characters",
                    required: true,
                    maxLength: 20
                },
                {
                    type: "string",
                    name: "long-string",
                    description: "A string longer than 10 characters",
                    required: true,
                    minLength: 10
                },
                {
                    type: "integer",
                    name: "high-integer",
                    description: "An integer greater than 10",
                    minValue: 10,
                    required: true
                },
                {
                    type: "integer",
                    name: "low-integer",
                    description: "An integer less than 10",
                    required: true,
                    maxValue: 10
                },
                {
                    type: "boolean",
                    name: "boolean",
                    description: "A boolean",
                    required: true
                },
                {
                    type: "number",
                    name: "number",
                    description: "A number",
                },
                {
                    type: "string",
                    name: "choice",
                    description: "A choice, yes or no",
                    choices: [
                        {
                            name: "Yes",
                            value: "yes"
                        },
                        {
                            name: "No",
                            value: "no"
                        }
                    ]
                }
            ]
        })
    }

    public override async run(interaction: ReceivedInteraction, options: OptionsHandler) {
        console.log(options)
        interaction.reply({
            content: `Arguments: ${JSON.stringify(options.data)}`
        })
    }
}
