import { Box, Divider, Stack, Typography } from "@mui/material";
import { useState } from "react";
import logs from '../../../log.json';
import { Scroll } from "../components/scroll/scroll";
import { CardCommit } from "./card-commit/card-commit";

type TrunkLog = {
    file: string;
    path: string;
    names: string[];
    emails: string[];
    commits: string[];
    hash: string[];
    totalCommits: number;
    totalDeleted: number;
    totalAdded: number;
    totalModified: number;
}[];

export const CommitView = () => {
    const [selectedCommitIndex, setSelectedCommitIndex] = useState<string>('');
    const [selectedFileIndex, setSelectedFileIndex] = useState<string>('');

    const handleClickFile = (selectedIndex: string) => {
        setSelectedFileIndex(selectedIndex);
    }

    const handleClickCommit = (selectedIndex: string) => {
        setSelectedCommitIndex(selectedIndex);
    }

    const trunkLog = getTrunkLog();
    // console.log(trunkLog);
    return (
        <Stack direction={'row'}>
            <Scroll>
                {trunkLog.map(({ file, path, commits, totalCommits, totalDeleted }, index) => (
                    <CardCommit /*10 - 21*/
                        key={`path-${index}`}
                        index={`path-${index}`}
                        selected={selectedFileIndex === `path-${index}`}
                        title={`${file.toUpperCase()} (${totalCommits})`}
                        subTitle={path.replace(file, '')}
                        onClick={handleClickFile}
                        cardContentChild={
                            <Box display={'flex'} flexDirection={'column'}>
                                {commits.map((c, index) => (<Typography key={index} variant={'caption'}>{c}</Typography>))}
                            </Box>
                        }
                    />
                ))}
            </Scroll>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Scroll>
                <CardCommit 
                    title={`<- Select`}
                    textAlign={'center'}/>
            </Scroll>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Scroll>
                <CardCommit 
                    title={`Select ->`}
                    textAlign={'center'}/>
            </Scroll>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Scroll>
                {logs.map(({ author }, index) => (
                    <CardCommit /* 7 - 13 */
                        key={`commit-${index}`}
                        index={`commit-${index}`}
                        selected={selectedCommitIndex === `commit-${index}`}
                        title={author.commit}
                        subTitle={`${author.name} (${author.email})`}
                        onClick={handleClickCommit}
                    />
                ))}
            </Scroll>
        </Stack>
    );
}

const getTrunkLog = (): TrunkLog => {
    return logs.reduce<TrunkLog>((p, c) => {
        c.files.forEach(({ status, path }) => {
            const index = p.findIndex(({ path: absolutePath }) => (absolutePath === path))

            if (index === -1) {
                p.push({
                    file: path.split('/').pop() || '',
                    path,
                    names: [c.author.name],
                    emails: [c.author.email],
                    commits: [c.author.commit],
                    hash: [c.author.hash],
                    totalCommits: 1,
                    totalDeleted: (status === 'D' ? 1 : 0),
                    totalAdded: (status === 'A' ? 1 : 0),
                    totalModified: (status === 'M' ? 1 : 0)
                });

                return p;
            }

            p[index].totalCommits += 1;

            !p[index].names.includes(c.author.name) && p[index].names.push(c.author.name);
            !p[index].emails.includes(c.author.email) && p[index].emails.push(c.author.email);
            !p[index].commits.includes(c.author.commit) && p[index].commits.push(c.author.commit);
            !p[index].hash.includes(c.author.hash) && p[index].hash.push(c.author.hash);

            status === 'D' && (p[index].totalDeleted += 1);
            status === 'A' && (p[index].totalAdded += 1);
            status === 'M' && (p[index].totalModified += 1);

            return p;
        })

        return p;
    }, [])
}

// 107 - 124