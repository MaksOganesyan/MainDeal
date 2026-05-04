import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { api } from '@/api/axios';

interface ImageUploadProps {
  endpoint: 'avatar' | 'deal' | 'announcement' | 'portfolio' | 'equipment';
  multiple?: boolean;
  maxFiles?: number;
  onUploadSuccess: (urls: string[]) => void;
  existingImages?: string[];
  onRemoveImage?: (url: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  endpoint,
  multiple = false,
  maxFiles = 10,
  onUploadSuccess,
  existingImages = [],
  onRemoveImage,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string[]>(existingImages);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Check file count
    if (multiple && files.length + preview.length > maxFiles) {
      setError(`Максимум ${maxFiles} изображений`);
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      
      if (multiple) {
        Array.from(files).forEach((file) => {
          formData.append('files', file);
        });
      } else {
        formData.append('file', files[0]);
      }

      const response = await api.post(`/upload/${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedUrls = multiple 
        ? response.data.map((item: any) => item.url)
        : [response.data.url];

      setPreview([...preview, ...uploadedUrls]);
      onUploadSuccess(uploadedUrls);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Ошибка при загрузке изображения');
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const handleRemove = (url: string) => {
    setPreview(preview.filter((img) => img !== url));
    if (onRemoveImage) {
      onRemoveImage(url);
    }
  };

  const getUploadsUrl = () => {
    return import.meta.env.VITE_NODE_ENV === 'production'
      ? 'https://dd.ilyacode.ru'
      : 'http://localhost:4200';
  };

  return (
    <Box>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id={`image-upload-${endpoint}`}
        type="file"
        multiple={multiple}
        onChange={handleFileSelect}
        disabled={uploading || (!multiple && preview.length >= 1)}
      />
      
      <label htmlFor={`image-upload-${endpoint}`}>
        <Button
          variant="outlined"
          component="span"
          startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}
          disabled={uploading || (!multiple && preview.length >= 1)}
          fullWidth
        >
          {uploading
            ? 'Загрузка...'
            : multiple
            ? `Загрузить изображения (${preview.length}/${maxFiles})`
            : preview.length > 0
            ? 'Изображение загружено'
            : 'Загрузить изображение'}
        </Button>
      </label>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {preview.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Загруженные изображения:
          </Typography>
          
          {multiple ? (
            <ImageList cols={3} gap={8}>
              {preview.map((url, index) => (
                <ImageListItem key={index}>
                  <img
                    src={`${getUploadsUrl()}${url}`}
                    alt={`Upload ${index + 1}`}
                    loading="lazy"
                    style={{ height: 150, objectFit: 'cover' }}
                  />
                  <ImageListItemBar
                    actionIcon={
                      <IconButton
                        sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                        onClick={() => handleRemove(url)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList>
          ) : (
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={`${getUploadsUrl()}${preview[0]}`}
                alt="Upload"
                style={{
                  maxWidth: '100%',
                  maxHeight: 200,
                  borderRadius: 8,
                  objectFit: 'cover',
                }}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                }}
                onClick={() => handleRemove(preview[0])}
              >
                <DeleteIcon sx={{ color: 'white' }} />
              </IconButton>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

