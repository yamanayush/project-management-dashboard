"use client";

import Link from "next/link";
import {
  useColorMode,
  IconButton,
  Tooltip,
  ColorModeScript,
  theme,
} from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { ReactNode, useState } from "react";
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

const Links = ["Home", "Project Select"];

interface NavLinkProps {
  children: ReactNode;
}

const NavLink = ({ children }: NavLinkProps) => {
  const linkColor = useColorModeValue("gray.200", "gray.700");
  return (
    <Link
      href={
        children === "Home"
          ? "/contractors"
          : children === "Project Select"
          ? "/contractors/all-projects"
          : "/contractors"
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

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isExpanded, setIsExpanded] = useState(true);
  const { data: session } = useSession();
  const defaultName = "User";
  const defaultImageURL = "";
  const { colorMode, toggleColorMode } = useColorMode();
  const backgroundColor = useColorModeValue("white", "gray.800");

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

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
      <Flex h={20} alignItems={"center"} justifyContent={"space-between"}>
        <IconButton
          size={"md"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={4} alignItems={"center"}>
          <Box>
            <div>
              <Link href="/contractors">
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
                    session?.user?.image ? session.user.image : defaultImageURL
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
                      Contractor
                    </Text>
                  ) : (
                    <Text fontSize="xs" color="gray.600">
                      Contractor
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
      </Flex>

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
