"use client";

import React, { ReactNode, useState } from "react";
import {
  Box,
  CloseButton,
  Flex,
  IconButton,
  Icon,
  useColorMode,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { IconType } from "react-icons";
import Link from "next/link";
import {
  IconHome,
  IconNotebook,
  IconFileAnalytics,
  IconFileSpreadsheet,
  IconFileInvoice,
  IconFileDollar,
} from "@tabler/icons-react";

interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Project Overview", icon: IconHome, path: "/contractors/project-overview" },
  { name: "Contractors", icon: IconNotebook, path: "/contractors/contractors" },
  { name: "Timesheets", icon: IconFileSpreadsheet, path: "/contractors/timesheets" },
];

interface SidebarProps {
  children: ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { colorMode } = useColorMode();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box minH="0px" bg={useColorModeValue("white", "gray.900")}>
      <Box
        bg={useColorModeValue("white", "gray.900")}
        borderTop="1px"
        borderTopColor={useColorModeValue("gray.200", "gray.600")}
        borderRight="1px"
        borderRightColor={useColorModeValue("gray.200", "gray.600")}
        w={isExpanded ? { base: "full", md: 60 } : { base: "full", md: 20 }}
        pos="fixed"
        h="full"
        top="81px"
        left={0}
        zIndex={1000}
      >
        <Flex
          justify="flex-start"
          direction="column"
          position="fixed"
          top={5}
          left={40}
        >
          <IconButton
            aria-label="Toggle-sidebar"
            onClick={toggleSidebar}
            ml={isExpanded ? "2" : "2"}
          >
            <FiMenu />
          </IconButton>
        </Flex>

        <Flex h="3" alignItems="center" mx="5" justifyContent="space-between">
          <CloseButton display={{ base: "flex", md: "none" }} />
        </Flex>
        {LinkItems.map((link) => (
          <Link key={link.name} href={link.path} passHref>
              <Flex
                align="center"
                p="3.5"
                mx="3"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                  bg: "cyan.300",
                  color: "white",
                }}
              >
                {!isExpanded ? (
                  <Tooltip
                    label={link.name}
                    aria-label="A tooltip"
                    placement="right-start"
                    bg="transparent"
                    color="black"
                    openDelay={0}
                  >
                    <Icon
                      fontSize="23"
                      _groupHover={{
                        color: "white",
                      }}
                      as={link.icon}
                    />
                  </Tooltip>
                ) : (
                  <Icon
                    mr="4"
                    fontSize="20"
                    _groupHover={{
                      color: "white",
                    }}
                    as={link.icon}
                  />
                )}
                {isExpanded && link.name}
              </Flex>
          </Link>
        ))}
      </Box>
      <Box ml={{ base: isExpanded ? 60 : 20, md: isExpanded ? 60 : 20 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Sidebar;
