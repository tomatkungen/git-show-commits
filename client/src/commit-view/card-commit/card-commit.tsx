import { Card, CardActionArea, CardContent, CardHeader } from "@mui/material";

type CardCommitProps = {
    title: string,
    selected?: boolean,
    active?: boolean,
    subTitle?: string,
    index?: string,
    onClick?: (selectedIndex: string) => void,
    cardContentChild?: React.ReactNode,
    textAlign?: React.CSSProperties['textAlign']
};

export const CardCommit = ({
    title,
    selected = false,
    active = false,
    subTitle,
    index = '',
    onClick,
    cardContentChild,
    textAlign = 'left'
}: CardCommitProps) => {
    return (
        <Card
            sx={{
                m: 1,
                minWidth: '200px',
                backgroundColor: (active ? '#346b30' : null),
                border: (selected ? '1px solid #717171' : null)
            }}
            onClick={() => onClick && onClick(index)}>
            <CardHeader
                title={title}
                subheader={subTitle}
                sx={{ textAlign }}
            />
            {cardContentChild &&
                <CardContent>{cardContentChild}</CardContent>
            }
        </Card>
    )
}
