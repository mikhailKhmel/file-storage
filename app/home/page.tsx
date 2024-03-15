'use client'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DialogTitle } from "@radix-ui/react-dialog"
import { Label } from "@radix-ui/react-label"
import { ArrowLeft, ArrowRight, ChevronsLeft, ChevronsRight, ClipboardCopyIcon, Loader2, Plus, Trash } from "lucide-react"
import { ChangeEvent, useEffect, useState } from "react"
import { FileModel } from "@/lib/types"
import { ITEMS_COUNT, convertBytesName } from "@/lib/utils"
import { LockClosedIcon, LockOpen1Icon } from "@radix-ui/react-icons"
import dayjs from 'dayjs'
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function HomePage() {
    const { toast } = useToast()
    const [files, setFiles] = useState<FileModel[]>([])
    const [loading, setLoading] = useState(true)
    const [fileValue, setFileValue] = useState<File[]>()
    const [checked, setChecked] = useState<string[]>([])
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(0)

    useEffect(() => {
        refresh()
    }, [page])

    const refresh = async () => {
        setLoading(true)
        const res = await fetch(`/api/files?page=${page}`)
        const { data, count } = await res.json()
        setFiles(data)
        setCount(count)
        setLoading(false)
        setChecked([])
    }

    const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const result = []
            for (let i = 0; i < e.target.files.length; i++) {
                result.push(e.target.files[i])
            }
            setFileValue(result)
        }
    }

    const handleAdd = async () => {
        if (!fileValue) {
            return
        }
        const formData = new FormData()
        for (let file of fileValue) {
            formData.append('file', file)
        }

        setLoading(true)
        await fetch('/api/files/add', {
            method: 'POST',
            body: formData
        })
        setLoading(false)
        refresh()
    }

    const handleDelete = async () => {
        if (checked.length === 0) {
            return
        }

        setLoading(true)
        await fetch('/api/files/delete', {
            method: 'POST',
            body: JSON.stringify(checked)
        })
        setLoading(false)
        refresh()
    }

    const handlePublic = async () => {
        if (checked.length === 0) {
            return
        }

        setLoading(true)
        await fetch('/api/files/public', {
            method: 'POST',
            body: JSON.stringify(checked)
        })
        setLoading(false)
        refresh()
    }

    const handleUnpublic = async () => {
        if (checked.length === 0) {
            return
        }

        setLoading(true)
        await fetch('/api/files/unpublic', {
            method: 'POST',
            body: JSON.stringify(checked)
        })
        setLoading(false)
        refresh()
    }

    const handleCheckAll = () => {
        if (checked.length === files.length) {
            setChecked([])
            return
        }

        setChecked(files.map(file => file.id))
    }

    const handleCheckOne = (id: string) => {
        if (checked.includes(id)) {
            setChecked(checked.filter(fileId => fileId !== id))
        } else {
            setChecked([...checked, id])
        }
    }

    const handleClipboard = (ids: string[]) => {
        if (ids.length === 0) {
            return
        }
        let result = ''
        for (let id of ids) {
            result += `${process.env.NEXT_PUBLIC_HOST}/${id} `
        }
        navigator.clipboard.writeText(result)
        toast({
            description: 'Ссылка скопирована'
        })
    }

    return (
        <div>
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-3 mb-3">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Plus />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Добавление нового файла</DialogTitle>
                            </DialogHeader>
                            <Label htmlFor="file">Файл</Label>
                            <Input id="file" type="file" multiple onChange={handleChangeFile} />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button className="w-full" disabled={!fileValue} onClick={handleAdd}>Загрузить</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Button variant="destructive" disabled={checked.length === 0} onClick={handleDelete}>
                        <Trash className="mr-2 size-5" /> Удалить файлы
                    </Button>
                    <Button variant="secondary" disabled={checked.length === 0} onClick={handlePublic}>
                        <LockOpen1Icon className="mr-2 size-5" /> Опубликовать
                    </Button>
                    <Button variant="secondary" disabled={checked.length === 0} onClick={handleUnpublic}>
                        <LockClosedIcon className="mr-2 size-5" /> Закрыть
                    </Button>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button variant="secondary" size="icon" disabled={checked.length === 0}
                                    onClick={() => handleClipboard(files.filter(file => file.isPublic).map(file => file.id))}>
                                    <ClipboardCopyIcon className="size-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Скопировать ссылки на все публичные файлы</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <div className="flex flex-row gap-3 items-center">
                    <Button variant="secondary" size="icon" disabled={page <= 1} onClick={() => setPage(1)}>
                        <ChevronsLeft className="size-5" />
                    </Button>
                    <Button variant="secondary" size="icon" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                        <ArrowLeft className="size-5" />
                    </Button>
                    <p>Страница {page} из {Math.floor(count / ITEMS_COUNT)}</p>
                    <Button variant="secondary" size="icon" disabled={page === Math.floor(count / ITEMS_COUNT)}>
                        <ArrowRight className="size-5" onClick={() => setPage(page + 1)} />
                    </Button>
                    <Button variant="secondary" size="icon" disabled={page === Math.floor(count / ITEMS_COUNT)} onClick={() => setPage(Math.floor(count / ITEMS_COUNT))}>
                        <ChevronsRight className="size-5" />
                    </Button>
                </div>
            </div>

            {loading ? <Loader2 className=" animate-spin size-12" /> :
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead><Checkbox checked={checked.length === files.length} onCheckedChange={handleCheckAll} /></TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Имя</TableHead>
                            <TableHead>Тип</TableHead>
                            <TableHead>Дата и время загрузки</TableHead>
                            <TableHead>Размер файла</TableHead>
                            <TableHead>Файл публичный?</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {files.map(file => {
                            return (
                                <TableRow key={file.id}>
                                    <TableHead><Checkbox checked={checked.includes(file.id)} onCheckedChange={() => handleCheckOne(file.id)} /></TableHead>
                                    <TableCell>{file.id}</TableCell>
                                    <TableCell>{file.name}</TableCell>
                                    <TableCell>{file.type}</TableCell>
                                    <TableCell>{dayjs(file.uploadedAt).format('DD.MM.YYYY HH:mm:ss')}</TableCell>
                                    <TableCell>{convertBytesName(file.size)}</TableCell>
                                    <TableCell>{file.isPublic ? 'Да' : 'Нет'}</TableCell>
                                    <TableCell>
                                        {file.isPublic && <Button variant="secondary" size="icon"
                                            onClick={() => handleClipboard([file.id])}>
                                            <ClipboardCopyIcon className="size-5" />
                                        </Button>}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        {files.length === 0 && <p>Ничего нет</p>}
                    </TableBody>
                </Table>

            }

            <Toaster />
        </div>
    )
}