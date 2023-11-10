import TextPair from '@components/text_pair/TextPair';
import './style/index.scss';
import TextButton from '@components/buttons/text_button';
import color from '@assets/styles/color';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AddNewMaterialModal from '@containers/modals/add_new_material_modal';
import { material } from '@services/dataTypes';
import { useOverlayStore } from '@services/zustand/overlayStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import AlertDialoge from '@components/alert_dialoge';
import toast from 'react-hot-toast';
import { queriesKeys } from '@services/queriesKeys';
import { deleteMaterial } from '@services/api/material_api/material.api';
import { CustomError } from '@libs/CustomError';

interface MaterialPreviewProps {
  courseId: string;
  material: material;
}
export default function MaterialPreview({
  courseId,
  material,
}: MaterialPreviewProps) {
  const { modal, close } = useOverlayStore();
  const [openDeleteMaterial, setOpenDeleteMaterial] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const deleteMaterialMutation = useMutation({
    mutationFn: () => deleteMaterial(material.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queriesKeys.Course, courseId],
      });
      handleDeleteMaterialClose();
      toast.success('Material has been deleted successfully');
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });

  const handleDeleteMaterialOpen = () => {
    setOpenDeleteMaterial(true);
  };

  const handleDeleteMaterialClose = () => {
    setOpenDeleteMaterial(false);
  };

  return (
    <div className="material-preview">
      <div className="video-preview-content">
        <InsertDriveFileIcon css={{ width: 40, height: 40 }} />
        <TextPair
          first={{
            text: material.title,
            fontColor: color.good_black,
            fontWeight: 600,
            fontSize: 17,
          }}
          second={
            <span className="video-preview-link">
              <a
                href={material.content}
                target="_blank"
                rel="noopener noreferrer"
              >
                {material.content}
              </a>
            </span>
          }
          gap={0}
        />
      </div>
      <div className="video-preview-controls">
        <TextButton
          onPress={() => {
            modal(
              <AddNewMaterialModal
                courseId={courseId}
                lessonId={material.lesson_id}
                defaultValues={material}
              />,
              'Update Material',
              {
                modalStyle: {
                  width: '50%',
                },
              },
            ).open();
          }}
          Icon={<EditIcon css={{ color: 'white', width: 20 }} />}
          backgroundColor={color.primary}
          fontColor={color.white}
          padding={'5px 8px'}
        />
        <TextButton
          onPress={handleDeleteMaterialOpen}
          backgroundColor={color.hot_red}
          fontColor={color.white}
          padding={'5px 8px'}
          Icon={<DeleteIcon css={{ color: 'white', width: 20 }} />}
        />
        <AlertDialoge
          name="Material"
          open={openDeleteMaterial}
          onClose={handleDeleteMaterialClose}
          deleteMutaion={() => deleteMaterialMutation.mutate()}
        />
      </div>
    </div>
  );
}
