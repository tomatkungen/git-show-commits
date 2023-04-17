import { Box, Checkbox } from "@mui/material"
import { useState } from "react"

type CheckboxLabelProps = {
    onChange(label: string, selected: boolean): void;
    text: string;
}

export const CheckboxLabel = ({
    onChange,
    text
}: CheckboxLabelProps) => {
    const [checked, isChecked] = useState<boolean>(false)

    const handleChange = (text: string) => {
        isChecked((prev) => !prev);
        onChange && onChange(text, !checked);
    }

    return (
        <Box>
            <Checkbox
                onChange={() => handleChange(text)}
                color={'secondary'}
                checked={checked}/>
                {text}
        </Box>
    )
}