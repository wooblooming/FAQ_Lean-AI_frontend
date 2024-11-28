import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';

export default function FeedUpload({ onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('original_name', selectedFile.name.split('.')[0]); // 확장자를 제외한 원본 이름 추가
    onUpload(formData);
};


  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <Card className="w-full m-4 bg-white ">
      <CardContent className="p-2 md:p-4 flex flex-col justify-center items-center w-full">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer bg-gray-200 w-full md:w-1/2 ${
            isDragActive ? 'border-gray-600 bg-primary/10' : ''
          }`}
        >
          <input {...getInputProps()} />
          {preview ? (
            <div className="relative aspect-square w-full">
              <Image
                src={preview}
                alt="Preview"
                layout="fill"
                objectFit="contain"
                className="rounded-md "
              />
              <button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 rounded-full bg-indigo-500 text-white p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-600 mb-4" />
              <p className="text-gray-600" style={{fontFamily:'NanumSquareBold'}}>
                {isDragActive ? '여기에 파일을 놓으세요' : '클릭하거나 파일을 여기로 끌어다 놓으세요'}
              </p>
            </div>
          )}
        </div>
        <Button onClick={handleUpload} className="w-full md:w-1/2 mt-4" disabled={!selectedFile}>
          업로드
        </Button>
      </CardContent>
    </Card>
  );
}
