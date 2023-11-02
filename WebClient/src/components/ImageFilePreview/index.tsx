import React from 'react';

import styles from './style.module.scss'
import { PlusOutlined } from '@ant-design/icons';
import { readFile } from '../../utils';
import { message } from 'antd';

export interface ImageFile {
    filePreview: string | null,
    fileSend: File | null,
}

interface State {
    attachFile: ImageFile
}

interface Props {
    onChange: (image: ImageFile) => void
    className?: string,
    value?: string,
}

export default function ImageFilePreview({
    onChange,
    className,
    value,
}: Props) {

    const [state, setState] = React.useState<State>({
        attachFile: { filePreview: null, fileSend: null },
    })

    const inputRef = React.useRef<HTMLInputElement>(null)

    const onClickAttackFileIcon = React.useCallback(() => {
        inputRef.current?.click()
    }, [])

    const onChangeInputFiles = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(async (event) => {
        if (event.target.files) {
            const selectedFile = event.target.files?.[0]

            if (selectedFile.type.startsWith('image/')) {
                const response = await readFile(selectedFile);

                onChange({ filePreview: response.result as string, fileSend: selectedFile ?? null })

                setState((prevState) => ({
                    ...prevState, attachFile: {
                        filePreview: response.result as string,
                        fileSend: selectedFile ?? null, // ?? lay ve ben phai khi ben trai chi undefine hoac null
                    }
                }))
            } else {
                message.error("Tệp không hợp lệ", 3)
            }
        }

        if (inputRef.current) {
            inputRef.current.value = ''
        }

    }, [onChange])

    React.useEffect(() => {
        if (value) {
            setState((prevState) => ({
                ...prevState, attachFile: {
                    filePreview: value,
                    fileSend: null, // ?? lay ve ben phai khi ben trai chi undefine hoac null
                }
            }))
        }
    }, [value])

    return (
        <div className={`${styles.imageFilePreviewContainer} ${className} center column`} onClick={onClickAttackFileIcon}>
            <PlusOutlined className='custom-icon' />
            <div className='text'>Tải Ảnh</div>
            <input type="file" ref={inputRef} accept="image/*" hidden onChange={onChangeInputFiles} />
            {state.attachFile.filePreview && (
                <img alt="" src={state.attachFile.filePreview} className='file-preview' />
            )}
        </div>
    )

}