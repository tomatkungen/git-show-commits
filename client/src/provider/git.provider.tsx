import React from "react";
import logs from '../../../log.json';

type GitProviderProps = React.PropsWithChildren<{}>

type FlatLog = {
    file: string;
    path: string;
    strikePaths: string[];
    names: string[];
    emails: string[];
    commits: string[];
    hash: string[];
    totalCommits: number;
    totalDeleted: number;
    totalAdded: number;
    totalModified: number;
    totalCopied: number;
    totalRenamed: number;
};

type GitCreateContext = {
    getGitFlatLogs(): FlatLog[];
    getGitCommitsByHash(hash: string[]): typeof logs;
    getGitCommitFilesByHash(hash: string): FlatLog[];
    getGitCommitFilesSuffix(): string[];
}

export const GitContext = React.createContext<GitCreateContext>({
    getGitFlatLogs: () => [],
    getGitCommitsByHash: () => [],
    getGitCommitFilesByHash: () => [],
    getGitCommitFilesSuffix: () => []
});

export const GitProvider = ({ children }: GitProviderProps) => {

    const getGitFlatLogs = (): FlatLog[] => (gitFlatLogs());
    const getGitCommitsByHash = (hash: string[]): typeof logs => (gitCommitsByHash(hash));
    const getGitCommitFilesByHash = (hash: string): FlatLog[] => (gitCommitFilesByHash(hash));
     const getGitCommitFilesSuffix = (): string[] => (gitCommitFilesSuffix());

    return (
        <GitContext.Provider value={{
            getGitFlatLogs,
            getGitCommitsByHash,
            getGitCommitFilesByHash,
            getGitCommitFilesSuffix
        }}>
            {children}
        </GitContext.Provider>
    )
}

const gitCommitFilesSuffix = (): string[] => {
    return gitFlatLogs()
        .reduce((p, c) => {
            const lastSuffix = c.file.split('.').pop() || '';

            if (!p.includes(`.${lastSuffix}`)) {
                p.push(`.${lastSuffix}`);
            }

            return p;
        }, [] as string[]);
}

const gitCommitFilesByHash = (hash: string) => {
    return gitFlatLogs().filter((gitFlatLog) => (
        gitFlatLog.hash.includes(hash)
    ));
}

const gitCommitsByHash = (hash: string[]) => (
    logs.filter(({ author }) =>
        (hash.includes(author.hash)))
);

const gitFlatLogs = (): FlatLog[] => {
    return logs.reduce<FlatLog[]>((p, c) => {
        c.files.forEach(({ status, paths }) => {
            const index = p.findIndex(({ path: absolutePath }) => (absolutePath === paths[paths.length - 1]))

            const currentPath = paths[paths.length - 1];
            const strikePaths = [...paths].reverse();
            strikePaths.shift();

            if (index === -1) {
                p.push({
                    file: currentPath.split('/').pop() || '',
                    path: currentPath,
                    strikePaths,
                    names: [c.author.name],
                    emails: [c.author.email],
                    commits: [c.author.commit],
                    hash: [c.author.hash],
                    totalCommits: 1,
                    totalDeleted: (status === 'D' ? 1 : 0),         // Delete
                    totalAdded: (status === 'A' ? 1 : 0),           // Added
                    totalModified: (status === 'M' ? 1 : 0),        // Modified
                    totalCopied: (status.includes('C') ? 1: 0),     // Copy
                    totalRenamed: (status.includes('R') ? 1 : 0)    // Renaming
                });

                return p;
            }

            p[index].totalCommits += 1;
            p[index].strikePaths = [...p[index].strikePaths, ...strikePaths];

            !p[index].names.includes(c.author.name) && p[index].names.push(c.author.name);
            !p[index].emails.includes(c.author.email) && p[index].emails.push(c.author.email);
            !p[index].commits.includes(c.author.commit) && p[index].commits.push(c.author.commit);
            !p[index].hash.includes(c.author.hash) && p[index].hash.push(c.author.hash);

            status === 'D' && (p[index].totalDeleted += 1);
            status === 'A' && (p[index].totalAdded += 1);
            status === 'M' && (p[index].totalModified += 1);
            status.includes('C') && (p[index].totalCopied += 1);
            status.includes('R') && (p[index].totalRenamed += 1);

            return p;
        })

        return p;
    }, [])
}