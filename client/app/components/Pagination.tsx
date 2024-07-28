import React from "react";
import { Box, Button } from "@chakra-ui/react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }
  
  const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const nextPage = () => {
      if (currentPage < totalPages) {
        onPageChange(currentPage + 1);
      }
    };

  const prevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <Box my={10} textAlign="center">
      <Button colorScheme="blue" mr={4} onClick={prevPage} disabled={currentPage === 1}>
        Previous
      </Button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <Button colorScheme="blue" ml={4} onClick={nextPage} disabled={currentPage === totalPages}>
        Next
      </Button>
    </Box>
  );
};

export default Pagination;
