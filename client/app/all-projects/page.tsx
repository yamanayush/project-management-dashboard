"use client";

import {
  Box,
  Flex,
  Text,
  Button,
  Badge,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import Providers from "../components/Providers";
import Chakra from "../components/Chakra";
import Navbar from "../components/ProjectNavbar";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Project {
  _id: string;
  Project_Number: string;
  Client_Company_Name: string;
  Client_Contact_Name: string;
  Client_Email: string;
  Client_Contact_Phone_Number: string;
  Client_Address: string;
  Project_Name: string;
  Project_Description: string;
  Proposed_Start_Date: string;
  Proposed_Project_Completion_Date: string;
  Project_Disciplines_Engineering: string[];
  Project_Disciplines_Design_Drafting: string[];
  Project_Type: string;
  Status: string;
  "As of date:": number;
  "Total Approved Budget:": number;
  "Original PO Value:": number;
  "Expenses: (ABSA Fees, TSSA fees, etc.):": number;
  "Approx. hours remaining (based on blended rate of $120/hour)": number;
  "Remaining Budget:": number;
  Contractors: {
    Contractor_Name: string;
    Contractor_Phone_Number: string;
    Contractor_Email: string;
    Contractor_Availability: string;
    Start_Date: string;
    Specialty_Discipline: string;
    Contractor_Hourly_Rate: number;
    Discipline_Charge_Out_Rate: number;
  }[];
}

console.log(`${process.env.NEXT_PUBLIC_HOST}/api/projects`);

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      console.log(`${process.env.NEXT_PUBLIC_HOST}/api/projects`);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/projects`
      );
      const data = await response.json();
      console.log("Projects:", data);
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const selectProject = (project: Project) => {
    setSelectedProject(project);
    // Handle project selection
    console.log("Selected project:", project);
  };

  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Providers>
      <Chakra>
        <Navbar />
        <Flex direction="column" w="full" p={5}>
          <Flex
            mt={20}
            direction="column"
            align="center"
            justify="center"
            w="full"
          >
            {projects &&
              projects
                .filter((project) => project.Status !== "Request")
                .map((project, index) => (
                  <Box
                    key={index}
                    width="full"
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    p={8}
                    boxShadow="lg"
                    m={3}
                  >
                    {/* Project details */}
                    <Flex justifyContent="space-between">
                      <Box>
                        <Text mb={2}>
                          <strong>Project Name:</strong> {project.Project_Name}
                        </Text>
                        <Text mb={2}>
                          <strong>Project Number:</strong>{" "}
                          {project.Project_Number}
                        </Text>
                      </Box>
                      {/* Status and action */}
                      <Flex align="center">
                        <Text mr={2}>
                          <strong>As of date:</strong>{" "}
                          {project.Proposed_Start_Date ?
                            project.Proposed_Start_Date.slice(0, 10) : "N/A"}
                        </Text>
                        <strong className="mr-2">Status:</strong>
                        <Badge
                          colorScheme="white"
                          borderRadius="lg"
                          px={2}
                          py={1}
                          borderWidth={1}
                          borderColor={
                            project.Status === "Complete"
                              ? "green"
                              : project.Status === "In Progress"
                              ? "blue"
                              : "red"
                          }
                        >
                          {project.Status}
                        </Badge>
                        <Link href={`/admin`}>
                          <Button
                            rightIcon={<ChevronRightIcon />}
                            colorScheme="blue"
                            ml={6}
                            onClick={() => {
                              selectProject(project);
                              localStorage.setItem(
                                "selectedProjectInfo",
                                JSON.stringify({
                                  id: project._id,
                                  name: project.Project_Name,
                                  number: project.Project_Number,
                                })
                              );
                              console.log("Selected project:", project);
                            }}
                          >
                            Open
                          </Button>
                        </Link>
                      </Flex>
                    </Flex>
                    {/* Project description */}
                    <Divider my={3} borderColor={borderColor} />
                    <Text>
                      <strong>Project Description:</strong>{" "}
                      {project.Project_Description}
                    </Text>
                  </Box>
                ))}
          </Flex>
        </Flex>
      </Chakra>
    </Providers>
  );
};

export default Projects;
