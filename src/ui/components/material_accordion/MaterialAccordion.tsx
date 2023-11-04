import './style/index.scss';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import color from '@assets/styles/color';
import Header from '@components/header';
import { material } from '@services/dataTypes';
import BlueAddButton from '@components/buttons/blue_add_button';
import MaterialPreview from '@components/material_preview';
import TextPair from '@components/text_pair/TextPair';
import AddNewMaterialModal from '@containers/modals/add_new_material_modal';
import { useOverlayStore } from '@services/zustand/overlayStore';
import AddNewMaterialLocalModal from '@containers/modals/add_new_material_local_modal';

interface CustomAccordionProps {
  headerNode?: ReactNode;
  onChange: (event: React.SyntheticEvent, isExpanded: boolean) => void;
  expanded: boolean;
  materials: material[];
  id: string;
  courseId: string;
}
export default function MaterialAccordion({
  headerNode,
  materials,
  onChange,
  expanded,
  id,
  courseId,
}: CustomAccordionProps) {
  const { modal, close } = useOverlayStore();

  return (
    <Accordion
      expanded={expanded}
      onChange={onChange}
      className="custom-accordion"
    >
      <AccordionSummary
        aria-controls={`panel${id}d-content`}
        id={`panel${id}d-header`}
      >
        <Header
          title={{
            text: 'Materials',
            fontColor: color.primary,
            fontWeight: 600,
            fontSize: 18,
          }}
          flexGrow={1}
          buttonNode={headerNode}
        />
      </AccordionSummary>
      <AccordionDetails className="panel-details">
        {materials.length > 0 ? (
          <>
            <div className="header-button-wrapper">
              <BlueAddButton
                text="Add New Material using url"
                onPress={() => {
                  modal(
                    <AddNewMaterialModal courseId={courseId} lessonId={id} />,
                    'Add New Material',
                    {
                      modalStyle: {
                        width: '50%',
                      },
                    },
                  ).open();
                }}
              />
              <span>Or</span>
              <BlueAddButton
                text="Add New Material by Local File"
                onPress={() => {
                  modal(
                    <AddNewMaterialLocalModal
                      courseId={courseId}
                      lessonId={id}
                    />,
                    'Add New Material',
                    {
                      modalStyle: {
                        width: '50%',
                      },
                    },
                  ).open();
                }}
              />
            </div>
            <div className="material-list">
              {materials.map((material) => (
                <MaterialPreview
                  key={material.id}
                  material={material}
                  courseId={courseId}
                />
              ))}
            </div>
          </>
        ) : (
          <TextPair
            first={{
              text: 'No Materials yet, you can start adding material from the options below',
              fontColor: color.good_black,
              fontWeight: 600,
              fontSize: 16,
            }}
            second={
              <div
                className="header-button-wrapper"
                css={{ justifyContent: 'center', alignItems: 'center' }}
              >
                <BlueAddButton
                  text="Add New Material using url"
                  onPress={() => {
                    modal(
                      <AddNewMaterialModal courseId={courseId} lessonId={id} />,
                      'Add New Material',
                      {
                        modalStyle: {
                          width: '50%',
                        },
                      },
                    ).open();
                  }}
                />
                <span>Or</span>
                <BlueAddButton
                  text="Add New Material by Local File"
                  onPress={() => {
                    modal(
                      <AddNewMaterialLocalModal
                        courseId={courseId}
                        lessonId={id}
                      />,
                      'Add New Material',
                      {
                        modalStyle: {
                          width: '50%',
                        },
                      },
                    ).open();
                  }}
                />
              </div>
            }
            gap={15}
            alignItems="center"
          />
        )}
      </AccordionDetails>
    </Accordion>
  );
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: color.white,
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));
