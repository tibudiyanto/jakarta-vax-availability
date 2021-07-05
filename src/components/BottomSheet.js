import React from 'react'
import { Portal, Box } from '@chakra-ui/react'

export const BottomSheet = ({ children, onClose }) => {
  return (
    <Portal>
      <Box
        className="bottom-sheet"
        style={{
          position: 'fixed',
          bottom: 0,
          zIndex: 100,
          borderTop: '1px',
          borderLeft: 'none',
          borderRight: 'none',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          height: '100%',
          width: '100%'
        }}>
        <Box className="bottom-sheet-layer" style={{
          background: 'rgba(0, 0, 0, 0.5)',
          height: '60%',
        }}
          onClick={onClose}
        ></Box>
        <Box style={{
          background: 'white',
          padding: '20px',
          border: '1px solid transparent',
          borderRadius: '10px',
          borderBottomLeftRadius: '0px',
          borderBottomRightRadius: '0px',
          height: '40%',
        }}>
          {children}
        </Box>
      </Box>
    </Portal>
  )
}
