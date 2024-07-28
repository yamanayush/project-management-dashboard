"use client";

import Link from "next/link";
import {
  useColorMode,
  IconButton,
  Tooltip,
  ColorModeScript,
  theme,
  GridItem,
  Grid,
} from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  VStack,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { FiChevronDown, FiMenu } from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Links = ["Home", "Project Select", "RFQ Form"];

interface NavLinkProps {
  children: ReactNode;
}

const NavLink = ({ children }: NavLinkProps) => {
  const backgroundColor = useColorModeValue("white", "gray.800");
  const linkColor = useColorModeValue("gray.200", "gray.700");
  return (
    <Link
      href={
        children === "Home"
          ? "/admin"
          : children === "Project Select"
          ? "/all-projects"
          : children === "RFQ Form"
          ? "/forms/request-for-quotation"
          : "/admin"
      }
      passHref
    >
      <Box
        px={2}
        py={1}
        rounded={"md"}
        _hover={{
          textDecoration: "none",
          bg: linkColor,
        }}
      >
        {children}
      </Box>
    </Link>
  );
};

const getCurrentRoute = () => {
  if (typeof window !== "undefined") {
    return window.location.pathname;
  }
  return null;
};

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isExpanded, setIsExpanded] = useState(true);
  const { data: session } = useSession();
  const defaultName = "User";
  const defaultImageURL = "";
  const { colorMode, toggleColorMode } = useColorMode();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  interface SelectedProject {
    name: string;
    number: string;
  }

  const [selectedProject, setSelectedProject] = useState<SelectedProject | null>(null);

  useEffect(() => {
    const storedProject =
      typeof window !== "undefined"
        ? localStorage.getItem('selectedProjectInfo')
        : null;
    if (storedProject) {
      try {
        setSelectedProject(JSON.parse(storedProject) as SelectedProject);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  // Get the current route
  const currentRoute = getCurrentRoute();

  // Check if the current route is '/all-projects'
  const isAllProjectsRoute = currentRoute === "/all-projects";

const backgroundColor = useColorModeValue("white", "gray.800");

  return (
    <Box
      bg={useColorModeValue("white", "gray.800")}
      px={4}
      border="1px"
      borderColor={useColorModeValue("gray.200", "gray.900")}
      borderRightColor={useColorModeValue("gray.200", "gray.900")}
      borderBottomColor={useColorModeValue("gray.200", "gray.600")}
      borderLeftColor={useColorModeValue("gray.200", "gray.900")}
      position="fixed"
      w="100%"
      zIndex={1000}
    >
      <Grid templateColumns="repeat(3, 1fr)" gap={6} h={20} alignItems="center">
        <GridItem>
          <HStack spacing={4} alignItems={"center"}>
            <IconButton
              size={"md"}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={"Open Menu"}
              display={{ md: "none" }}
              onClick={isOpen ? onClose : onOpen}
            />
            <Box>
              <div>
                <Link href="/admin">
                  {colorMode === "dark" ? (
                    <Image
                      alt="ANG Consultants"
                      width={90} // Set width for dark mode logo
                      height={70} // Set height for dark mode logo
                      className="flex ml-4"
                      src="/ANG_logo_white.png"
                      priority={true}
                    />
                  ) : (
                    <Image
                      alt="ANG Consultants"
                      width={110} // Set width for light mode logo
                      height={80} // Set height for light mode logo
                      className="flex ml-4"
                      src="/ANG_logo.png"
                      priority={true}
                    />
                  )}
                </Link>
              </div>
            </Box>

            <Box ml={20}>
              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "flex", md: "flex" }}
              >
                {Links.map((link) => (
                  <NavLink key={link}>{link}</NavLink>
                ))}
              </HStack>
            </Box>
          </HStack>
        </GridItem>

        <GridItem justifySelf="center">
          <Box textAlign="center">
            {selectedProject ? (
              <Text fontSize="l">
                Request for Quotation
              </Text>
            ) : (
              "Project Selection"
            )}
          </Box>
        </GridItem>

        <GridItem justifySelf="end">
          <Flex alignItems={"center"}>
            <Tooltip
              label={
                colorMode === "light" ? "Toggle Dark Mode" : "Toggle Light Mode"
              }
              aria-label="A tooltip"
            >
              <IconButton
                mt={1}
                mr={6}
                icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
                onClick={toggleColorMode}
                aria-label="Toggle dark mode"
                variant="outline"
              />
            </Tooltip>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <HStack>
                  <Avatar
                    size={"sm"}
                    src={
                      session?.user?.image
                        ? session.user.image
                        : defaultImageURL
                    }
                  />
                  <VStack
                    display={{ base: "none", md: "flex" }}
                    alignItems="flex-start"
                    spacing="1px"
                    ml="2"
                  >
                    <Text fontSize="sm">
                      {session?.user?.name ? session.user.name : defaultName}
                    </Text>
                    {colorMode === "dark" ? (
                      <Text fontSize="xs" color="gray.200">
                        Admin
                      </Text>
                    ) : (
                      <Text fontSize="xs" color="gray.600">
                        Admin
                      </Text>
                    )}
                  </VStack>

                  <Box display={{ base: "none", md: "flex" }}>
                    <FiChevronDown />
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} href="https://myaccount.google.com/">
                  Profile
                </MenuItem>
                <MenuItem>Settings</MenuItem>
                <MenuDivider />
                <MenuItem
                  onClick={() =>
                    signOut({ callbackUrl: `${window.location.origin}/login` })
                  }
                >
                  Log out
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </GridItem>
      </Grid>

      {isOpen ? (
        <Box
          pb={4}
          bg={backgroundColor}
          display={{ md: "none" }}
        >
          <Stack as={"nav"} spacing={4}>
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
