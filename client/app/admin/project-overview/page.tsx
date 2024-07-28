"use client";

import { useState, useRef, useEffect } from "react";
import {
  Flex,
  Box,
  Button,
  Text,
  Divider,
  FormControl,
  FormLabel,
  CheckboxGroup,
  HStack,
  VStack,
  Checkbox,
  Select,
  Grid,
  Input,
  SimpleGrid,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
  Textarea,
  Progress,
} from "@chakra-ui/react";
import {
  EditIcon,
  ExternalLinkIcon,
  AttachmentIcon,
  CheckIcon,
  CloseIcon,
  AddIcon,
  DeleteIcon,
  DownloadIcon,
} from "@chakra-ui/icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Comment = (string | number | Date | null)[];

type ProjectAPI = {
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
  Contractors: string[];
  Project_Comments: Comment[];
};

type ProjectFilesAPI = {
  id: string;
  length: number;
  chunkSize: number;
  uploadDate: Date;
  filename: string;
};

const ProjectOverview = () => {
  const saveProjectDataToLocalStorage = (data: ProjectAPI[]) => {
    localStorage.setItem("projectData", JSON.stringify(data));
  };

  const loadProjectDataFromLocalStorage = (): ProjectAPI[] => {
    const storedData = localStorage.getItem("projectData");
    if (storedData) {
      return JSON.parse(storedData);
    }
    return [];
  };

  const [projectData, setProjectData] = useState<ProjectAPI[]>([]);
  const [updateProject, setUpdateProject] = useState<ProjectAPI | null>(null);

  let selectedProjectInfo: any = null;

  // Check if 'window' is defined to avoid issues with SSR
  if (typeof window !== 'undefined') {
    // Retrieve selected project information from local storage
    const storedProjectInfo = localStorage.getItem("selectedProjectInfo");
    selectedProjectInfo = storedProjectInfo
      ? JSON.parse(storedProjectInfo)
      : null;
  }
  
  // Find the selected project based on project name and number
  const selectedProject = projectData.find(
    (project) =>
      project._id === selectedProjectInfo?.id.toString() &&
      project.Project_Number === selectedProjectInfo?.number &&
      project.Project_Name === selectedProjectInfo?.name
  );  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/projects`);
        const data = await response.json();
        setProjectData(data);
        saveProjectDataToLocalStorage(data); // Save project data to local storage
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    const storedProjectData = loadProjectDataFromLocalStorage(); // Load project data from local storage

    if (storedProjectData.length < 0) {
      setProjectData(storedProjectData);
    } else {
      fetchData();
    }
  }, []);

  const [projectFiles, setProjectFiles] = useState<ProjectFilesAPI[]>([]);

  useEffect(() => {
    if (selectedProject) {
      const fetchFileData = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_HOST}/api/files-project?id=${selectedProject?._id}`
          );
          const data = await response.json();
          setProjectFiles(data);
        } catch (error) {
          console.log("Error fetching project data:", error);
        }
      };

      fetchFileData();
    }
  }, [projectData]);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedDisciplinesEng, setSelectedDisciplinesEng] = useState<
    string[]
  >([]);
  const [
    selectedDisciplinesDesDraft,
    setSelectedDisciplinesDesDraft,
  ] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  // notification
  const toast = useToast();

  // attachments
  const [attachments, setAttachments] = useState<
    {
      fileName: string;
      fileSize: number;
      attachmentDate: Date;
    }[]
  >([]);

  //---  FOR PROJECT COMMENTS ---//
  const [tableRows, setTableRows] = useState<
    {
      id: string;
      deliverable: string;
      percentComplete: number;
      date: Date | null;
      comments: string;
    }[]
  >([
    {
      id: "row-0",
      deliverable: "",
      percentComplete: 0,
      date: null,
      comments: "",
    },
  ]);

  useEffect(() => {
    if (
      selectedProject &&
      selectedProject.Project_Comments &&
      selectedProject.Project_Comments.length > 0
    ) {
      const comments = selectedProject.Project_Comments;

      const rows = comments
        .map((comment, index) => {
          if (Array.isArray(comment) && comment.length >= 4) {
            return {
              id: `row-${index}`,
              deliverable: comment[0],
              percentComplete: comment[1]
                ? parseInt(comment[1] as string)
                : null,
              date: comment[2] ? new Date(comment[2]) : null,
              comments: comment[3],
            };
          } else {
            // Handle invalid comment array
            return null;
          }
        })
        .filter(Boolean); // Remove null values from the array

      // Ensure setTableRows is defined and is a function
      if (typeof setTableRows === "function") {
        //@ts-ignore
        setTableRows(rows);
      }
    }
  }, [selectedProject]);

  const handleConfirmSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(formRef.current!);
    console.log("Project Disciplines (Engineering): ", selectedDisciplinesEng);
    console.log(
      "Project Disciplines (Design & Drafting): ",
      selectedDisciplinesDesDraft
    );
    const projectType = formData.get("projectType");
    console.log("Project Type:", projectType);
    const startDate = formData.get("startDate");
    console.log("Start Date:", startDate);
    const endDate = formData.get("endDate");
    console.log("End Date:", endDate);

    const fields = {
      Project_Disciplines_Engineering: selectedDisciplinesEng,
      Project_Disciplines_Design_Drafting: selectedDisciplinesDesDraft,
      Project_Type: projectType,
      Proposed_Start_Date: startDate,
      Proposed_Project_Completion_Date: endDate,
    };

    const updatedProject = Object.fromEntries(
      Object.entries(fields).filter(
        ([_, value]) => value != null && value.length > 0
      )
    );

    // Check if updatedProject is empty
    if (Object.keys(updatedProject).length === 0) {
      toast({
        title: "No Changes",
        description:
          "No new data to update. Please fill out at least one field.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } else {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/projects?id=${selectedProject?._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProject),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        } else {
          toast({
            title: "Change Order Completed",
            description: "The project has been successfully updated.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }

        // Re-fetch data from the API after a successful update
        const newResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/projects`);
        const newData = await newResponse.json();

        // Update state or trigger re-render with new data
        // Assuming setProjectData is your state updater function
        setProjectData(newData);
      } catch (error) {
        console.error("Error:", error);
      }

      setIsEditable(false);
      setIsOpen(false);

      // Reset form fields
      formRef.current?.reset();
      setStartDate(null);
      setEndDate(null);
      setSelectedDisciplinesEng([]);
      setSelectedDisciplinesDesDraft([]);
    }
  };

  const handleCancelSubmit = () => {
    setIsEditable(false);
    setIsOpen(false);

    // Reset form fields
    formRef.current?.reset();
    setStartDate(null);
    setEndDate(null);
    setSelectedDisciplinesEng([]);
    setSelectedDisciplinesDesDraft([]);
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  // Define the TableRow type
  type TableRow = {
    deliverable: string;
    percentComplete: number;
    date: Date | null;
    comments: string;
  };

  const handleTableRowChange = (
    index: number,
    key: keyof TableRow,
    value: any
  ) => {
    const newTableRows = [...tableRows];
    if (key === "percentComplete" && value === "") {
      newTableRows[index][key] = value;
    } else {
      newTableRows[index] = {
        ...newTableRows[index],
        [key]: key === "percentComplete" ? Number(value) : value,
      };
    }
    setTableRows(newTableRows);
  };

  const handleAddRow = () => {
    const currentDate = new Date();

    setTableRows((prevRows) => [
      ...prevRows,
      {
        id: `row-${Date.now()}`,
        deliverable: "",
        percentComplete: 0,
        date: currentDate,
        comments: "",
      },
    ]);
  };

  const handleSaveClick = async (e: any, row: TableRow, index: number) => {
    e.preventDefault(); // Stop the form from submitting

    console.log("Saving rows:");
    console.log("Deliverable:", row.deliverable);
    console.log("Percent Complete:", row.percentComplete);
    console.log("Date:", row.date);
    console.log("Comments:", row.comments);

    const project = selectedProject;

    // Ensure that selectedProject exists
    if (project) {
      // If Project_Comments doesn't exist or is null, initialize it as an empty array
      if (!project.Project_Comments) {
        project.Project_Comments = [];
      }

      // Define the new array
      const newArray = [
        row.deliverable,
        row.percentComplete ? row.percentComplete + "%" : null, // Convert percent to string
        row.date ? new Date(row.date).toLocaleDateString() : null, // Convert Date object to string
        row.comments,
      ];

      // If the row exists, update it; else, add a new row
      if (index < project.Project_Comments.length) {
        project.Project_Comments[index] = newArray;
      } else {
        project.Project_Comments.push(newArray);
      }

      // Log the updated comments
      console.log(project.Project_Comments);

      const updateProjectCommments = {
        Project_Comments: project.Project_Comments,
      };

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/projects?id=${project?._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateProjectCommments),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        } else {
          toast({
            title: "Succesfully Saved",
            // description: "The project comment has been successfully saved.",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        }

        // Re-fetch data from the API after a successful update
        const newResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/projects`);
        const newData = await newResponse.json();

        // Update state or trigger re-render with new data
        // Assuming setProjectData is your state updater function
        setProjectData(newData);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const removeProjectComment = async (e: any, row: TableRow, index: number) => {
    e.preventDefault(); // Stop the event from bubbling up

    const project = selectedProject;

    // Ensure that selectedProject exists
    if (project) {
      // If Project_Comments doesn't exist or is null, initialize it as an empty array
      if (!project.Project_Comments) {
        project.Project_Comments = [];
      }

      // Remove the comment at the specified index
      project.Project_Comments.splice(index, 1);

      // Define the new comments array
      const updatedProjectComments = {
        Project_Comments: project.Project_Comments,
      };

      // Make the PATCH request
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/projects?id=${project._id.toString()}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProjectComments),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        } else {
          toast({
            title: "Project Comment Deleted",
            status: "info",
            duration: 2000,
            isClosable: true,
          });
        }

        // Re-fetch data from the API after a successful update
        const newResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/projects`);
        const newData = await newResponse.json();

        // Update state or trigger re-render with new data
        setProjectData(newData);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  const handleFileUpload = async (e: any) => {
    const files = e.target.files;

    if (files.length === 0) {
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("projFile", files[i]);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/upload-project?id=${selectedProject?._id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      toast({
        title: "File Uploaded",
        description: `${files[0].name} has been successfully uploaded and attached.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Re-fetch data from the API after a successful update
      const newResponse = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/files-project?id=${selectedProject?._id}`
      );
      const newData = await newResponse.json();
      setProjectFiles(newData);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleFileDownload = async () => {
    try {
      // Fetch the zip file from the API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/download-project?id=${selectedProject?._id}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // convert binary data to base64 encoded string
      const data = await response.arrayBuffer();
      const base64data = btoa(
        new Uint8Array(data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      // Create an anchor element and click it to download the file
      const a = document.createElement("a");
      a.href = `data:application/zip;base64,${base64data}`;
      a.download = "files.zip"; // the filename you want
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading files:", error);
    }
  };

  const handleSingleFileDownload = async (fileId: string, fileName: string) => {
    console.log(fileId);
    try {
      // Fetch the file from the API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/files-project?id=${selectedProject?._id}&fileId=${fileId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // convert binary data to base64 encoded string
      const data = await response.arrayBuffer();
      const base64data = btoa(
        new Uint8Array(data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      // Create an anchor element and click it to download the file
      const a = document.createElement("a");
      a.href = `data:application/octet-stream;base64,${base64data}`;
      a.download = fileName; // use the provided file name
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading files:", error);
    }
  };

  const handleDeleteAttachment = async (profileFile: ProjectFilesAPI) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/files-project?id=${
          selectedProject?._id
        }&fileId=${profileFile.id.toString()}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      toast({
        title: "File Deleted",
        description: `${profileFile.filename} has been successfully deleted.`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });

      // Re-fetch data from the API after a successful update
      const newResponse = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/files-project?id=${selectedProject?._id}`
      );
      const newData = await newResponse.json();
      setProjectFiles(newData);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const [totalCosts, setTotalCosts] = useState<number[]>([]);
  const [totalApprovedBudget, setTotalApprovedBudget] = useState<number>(0);

  useEffect(() => {
    const apiUrl = `${process.env.NEXT_PUBLIC_HOST}/api/project?number=88-02032023-01`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.contractors) {
          const totalCosts = data.contractors.map(
            (contractor: any) => contractor["Total cost"]
          );
          const totalApprovedBudget = data.project["Total Approved Budget:"];

          setTotalCosts(totalCosts);
          setTotalApprovedBudget(totalApprovedBudget);
          console.log(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const [totalCostsSum, setTotalCostsSum] = useState<number>(0);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);

  useEffect(() => {
    const totalCostsSum = totalCosts.reduce(
      (accumulator, currentCost) => accumulator + currentCost,
      0
    );
    setTotalCostsSum(totalCostsSum);

    // Add condition to avoid division by zero
    if (totalApprovedBudget > 0) {
      const progressPercentage = (totalCostsSum / totalApprovedBudget) * 100;
      setProgressPercentage(progressPercentage); // Update the state variable
    }
  }, [totalCosts, totalApprovedBudget]);

  return (
    <Flex>
      <Flex mt={20} direction="column" p={5} position="relative">
        <Flex justifyContent="space-between">
          <Box>
            <Heading size="lg">Project Information</Heading>
          </Box>
          <Flex alignItems="center">
            {!isEditable ? (
              <Button
                leftIcon={<EditIcon />}
                colorScheme="teal"
                variant="outline"
                onClick={handleEditClick}
              >
                Edit
              </Button>
            ) : (
              <Flex>
                <HStack spacing={2}>
                  <Button
                    leftIcon={<CloseIcon />}
                    variant="outline"
                    onClick={handleCancelSubmit}
                    mr={1}
                  >
                    Cancel
                  </Button>
                  <Button
                    leftIcon={<CheckIcon />}
                    colorScheme="teal"
                    variant="solid"
                    type="submit"
                    form="projectForm"
                  >
                    Submit
                  </Button>
                </HStack>
              </Flex>
            )}
            <Button
              rightIcon={<ExternalLinkIcon />}
              colorScheme="teal"
              ml={3}
              mr={-1}
            >
              Share to Contractors
            </Button>
          </Flex>
        </Flex>

        <Divider my={4} />

        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          {selectedProject ? (
            <Box minWidth="80vw">
              <Text>
                <strong>Project Name:</strong> {selectedProject.Project_Name}
              </Text>
              <Text>
                <strong>Project Number:</strong>{" "}
                {selectedProject.Project_Number}
              </Text>
              <Text>
                <strong>Project Description:</strong>{" "}
                {selectedProject.Project_Description}
              </Text>
              <Text>
                <strong>Project Disciplines (Engineering):</strong>{" "}
                {selectedProject.Project_Disciplines_Engineering.join(", ")}
              </Text>
              <Text>
                <strong>Project Disciplines (Design & Drafting):</strong>{" "}
                {selectedProject.Project_Disciplines_Design_Drafting.join(", ")}
              </Text>
              <Text>
                <strong>Project Type:</strong> {selectedProject.Project_Type}
              </Text>
              <Text>
                <strong>Project Start Date:</strong>{" "}
                {selectedProject.Proposed_Start_Date}
              </Text>
              <Text>
                <strong>Project End Date:</strong>{" "}
                {selectedProject.Proposed_Project_Completion_Date}
              </Text>
              <br />
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                Client Information
              </Text>
              <Text>
                <strong>Client Name:</strong>{" "}
                {selectedProject.Client_Contact_Name}
              </Text>
              <Text>
                <strong>Client Email:</strong> {selectedProject.Client_Email}
              </Text>
              <Text>
                <strong>Client Phone Number:</strong>{" "}
                {selectedProject.Client_Contact_Phone_Number}
              </Text>
              <Text>
                <strong>Client Company:</strong>{" "}
                {selectedProject.Client_Company_Name}
              </Text>
              <Text>
                <strong>Client Address:</strong>{" "}
                {selectedProject.Client_Address}
              </Text>
            </Box>
          ) : (
            <Flex direction="column">
              <Text>Loading project data...</Text>
              {/* <Box width="45%">
                <Progress
                  colorScheme="blue"
                  size="xs"
                  value={progressPercentage}
                  hasStripe
                  isAnimated
                  isIndeterminate
                />
              </Box> */}
            </Flex>
          )}
        </Grid>

        <Divider my={4} />

        <Text fontSize="xl" fontWeight="bold">
          Project Form for Change Order
        </Text>

        <form id="projectForm" ref={formRef} onSubmit={handleConfirmSubmit}>
          <SimpleGrid columns={3} spacing={10}>
            <FormControl id="projectDisciplinesEng" mt={4}>
              <FormLabel>Project Disciplines (Engineering)</FormLabel>
              <CheckboxGroup
                colorScheme="green"
                value={selectedDisciplinesEng} // Update the value prop
                onChange={(values: string[]) =>
                  setSelectedDisciplinesEng(values)
                }
                isDisabled={!isEditable}
              >
                <HStack spacing={5}>
                  <VStack align="start" spacing={1}>
                    <Checkbox value="Mechanical">Mechanical</Checkbox>
                    <Checkbox value="Structural">Structural</Checkbox>
                    <Checkbox value="Instrumentation">Instrumentation</Checkbox>
                  </VStack>
                  <VStack align="start" spacing={1}>
                    <Checkbox value="Civil">Civil</Checkbox>
                    <Checkbox value="Electrical">Electrical</Checkbox>
                    <Checkbox value="Pipeline">Pipeline</Checkbox>
                  </VStack>
                  <VStack align="start" spacing={1}>
                    <Checkbox value="Process">Process</Checkbox>
                    <Checkbox value="Stress">Stress</Checkbox>
                    <Checkbox value="Facilities">Facilities</Checkbox>
                  </VStack>
                </HStack>
              </CheckboxGroup>
            </FormControl>

            <FormControl id="projectDisciplinesDesDraft" mt={4}>
              <FormLabel>Project Disciplines (Design & Drafting)</FormLabel>
              <CheckboxGroup
                colorScheme="green"
                value={selectedDisciplinesDesDraft} // Update the value prop
                onChange={(values: string[]) =>
                  setSelectedDisciplinesDesDraft(values)
                }
                isDisabled={!isEditable}
              >
                <HStack spacing={5}>
                  <VStack align="start" spacing={1}>
                    <Checkbox value="Mechanical">Mechanical</Checkbox>
                    <Checkbox value="Structural">Structural</Checkbox>
                    <Checkbox value="Instrumentation">Instrumentation</Checkbox>
                  </VStack>
                  <VStack align="start" spacing={1}>
                    <Checkbox value="Civil">Civil</Checkbox>
                    <Checkbox value="Electrical">Electrical</Checkbox>
                    <Checkbox value="Pipeline">Pipeline</Checkbox>
                  </VStack>
                  <VStack align="start" spacing={1}>
                    <Checkbox value="Process">Process</Checkbox>
                    <Checkbox value="Stress">Stress</Checkbox>
                    <Checkbox value="Facilities">Facilities</Checkbox>
                  </VStack>
                </HStack>
              </CheckboxGroup>
            </FormControl>
          </SimpleGrid>

          <Box maxW="300px">
            <FormControl id="projectType" mt={4}>
              <FormLabel>Project Type</FormLabel>
              <Select
                name="projectType"
                placeholder="Select Type"
                isDisabled={!isEditable}
              >
                <option value="Pre-Feed">Pre-Feed</option>
                <option value="Feed">Feed</option>
                <option value="Detailed Design">Detailed Design</option>
                <option value="Technical Review">Technical Review</option>
                <option value="Etc.">Etc.</option>
              </Select>
            </FormControl>
          </Box>

          <SimpleGrid columns={3} spacing={10}>
            <Box maxW="300px">
              <FormControl id="startDate" mt={4}>
                <FormLabel>Proposed Start Date (Optional)</FormLabel>
                <DatePicker
                  name="startDate"
                  selected={startDate}
                  onChange={(date: Date) => setStartDate(date)}
                  customInput={<Input isDisabled={!isEditable} />}
                  placeholderText="Select Date"
                  disabled={!isEditable}
                  // Add minDate and maxDate props if needed
                  // minDate={new Date()} // Example: restrict to current date and future dates
                  // maxDate={someMaxDate} // Example: restrict to a maximum date
                />
              </FormControl>
            </Box>

            <Box maxW="300px">
              <FormControl id="endDate" mt={4}>
                <FormLabel>Proposed End Date (Optional)</FormLabel>
                <DatePicker
                  name="endDate"
                  selected={endDate}
                  onChange={(date: Date) => setEndDate(date)}
                  customInput={<Input isDisabled={!isEditable} />}
                  placeholderText="Select Date"
                  disabled={!isEditable}
                  // Add minDate and maxDate props if needed
                  // minDate={new Date()} // Example: restrict to current date and future dates
                  // maxDate={someMaxDate} // Example: restrict to a maximum date
                />
              </FormControl>
            </Box>
          </SimpleGrid>

          <Divider my={4} />

          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Budgeted Hours
          </Text>

          <Text fontSize="xl">
            Total Approved Budget: ${totalApprovedBudget}
          </Text>

          <Text fontSize="xl">Total Cost Used: ${totalCostsSum}</Text>

          <Text fontSize="xl" mt={4} mb={1}>
            {/* Display the percentage here */}
            Budget Hours Used: <strong>{progressPercentage.toFixed(2)}%</strong>
          </Text>

          <Box width="45%">
            <Progress
              colorScheme="teal"
              size="md"
              value={progressPercentage}
              hasStripe
              isAnimated
            />
          </Box>

          <Divider my={5} />

          <Text fontSize="xl" fontWeight="bold" mb={3}>
            Project Comments
          </Text>

          <Flex>
            <IconButton
              icon={<AddIcon />}
              colorScheme="teal"
              variant="outline"
              aria-label="Add Row"
              onClick={handleAddRow}
              disabled={!isEditable}
              mt={3}
              mr={5}
            />
            {/* ... */}
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Deliverable</Th>
                  <Th>Percent Complete</Th>
                  <Th>Date</Th>
                  <Th>Comments</Th>
                  <Th>Save</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {tableRows.map((row, index) => (
                  <Tr key={index}>
                    <Td>
                      <Input
                        mb={12}
                        value={row.deliverable}
                        onChange={(e) =>
                          handleTableRowChange(
                            index,
                            "deliverable",
                            e.target.value
                          )
                        }
                      />
                    </Td>
                    <Td>
                      <Select
                        mb={12}
                        value={row.percentComplete}
                        onChange={(e) => {
                          let inputValue = e.target.value;
                          let numValue =
                            inputValue === "null" ? null : Number(inputValue);
                          handleTableRowChange(
                            index,
                            "percentComplete",
                            numValue
                          );
                        }}
                      >
                        <option value="null">-</option>{" "}
                        {/* Added null option */}
                        <option value="5">5%</option>
                        <option value="10">10%</option>
                        <option value="15">15%</option>
                        <option value="20">20%</option>
                        <option value="25">25%</option>
                        <option value="30">30%</option>
                        <option value="35">35%</option>
                        <option value="40">40%</option>
                        <option value="45">45%</option>
                        <option value="50">50%</option>
                        <option value="55">55%</option>
                        <option value="60">60%</option>
                        <option value="65">65%</option>
                        <option value="70">70%</option>
                        <option value="75">75%</option>
                        <option value="80">80%</option>
                        <option value="85">85%</option>
                        <option value="90">90%</option>
                        <option value="95">95%</option>
                        <option value="100">100%</option>
                      </Select>
                    </Td>

                    <Td>
                      <Flex mb={12}>
                        <DatePicker
                          selected={row.date ? new Date(row.date) : null}
                          onChange={(date: Date | null) =>
                            handleTableRowChange(
                              index,
                              "date",
                              date ? date.toISOString() : null
                            )
                          }
                          customInput={<Input isDisabled={!isEditable} />}
                          placeholderText="Select Date"
                          // isClearable
                        />
                      </Flex>
                    </Td>

                    <Td>
                      <Textarea
                        mt={2}
                        value={row.comments}
                        size="md" // Adjust the size to your preference
                        height="100px" // Set the desired height for the textarea
                        onChange={(e) =>
                          handleTableRowChange(
                            index,
                            "comments",
                            e.target.value
                          )
                        }
                      />
                    </Td>

                    <Td>
                      <IconButton
                        icon={<CheckIcon />}
                        colorScheme="teal"
                        // variant="outline"
                        aria-label="Save Row"
                        onClick={(e) => handleSaveClick(e, row, index)}
                        disabled={!isEditable}
                      />
                    </Td>
                    <Td>
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        variant="outline"
                        aria-label="Delete Row"
                        onClick={(e) => removeProjectComment(e, row, index)}
                        disabled={!isEditable}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Flex>
        </form>

        <Divider my={4} />

        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="xl" fontWeight="bold">
            Attachments
          </Text>

          <Box>
            <Button
              as="label"
              htmlFor="fileUpload"
              leftIcon={<AttachmentIcon />}
              cursor="pointer"
              colorScheme="teal"
              variant="outline"
              mt={2}
            >
              Attach File
            </Button>
            <Button
              leftIcon={<DownloadIcon />}
              cursor="pointer"
              colorScheme="teal"
              onClick={handleFileDownload}
              mt={2}
              ml={3}
            >
              Download All
            </Button>
          </Box>
          <Input
            id="fileUpload"
            type="file"
            accept=".xls,.xlsx,.xlsm,.csv,.docx,.pdf,.ppt,"
            multiple
            onChange={handleFileUpload}
            opacity={0}
            position="absolute"
            zIndex="-1"
          />
        </Flex>

        <Table variant="simple" mt={5}>
          <Thead>
            <Tr>
              <Th>File Name</Th>
              <Th>Attachment Size</Th>
              <Th>Attachment Date</Th>
              <Th>Download</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {projectFiles &&
              projectFiles.length > 0 &&
              projectFiles.map((projectFile) => (
                <Tr key={projectFile.id}>
                  <Td>{projectFile.filename}</Td>
                  <Td>{(projectFile.length / (1024 * 1024)).toFixed(2)} MB</Td>
                  <Td>{new Date(projectFile.uploadDate).toLocaleString()}</Td>
                  <Td>
                    <IconButton
                      icon={<DownloadIcon />}
                      colorScheme="blue"
                      variant="outline"
                      aria-label="Download Attachment"
                      onClick={() =>
                        handleSingleFileDownload(
                          projectFile.id.toString(),
                          projectFile.filename
                        )
                      }
                    />
                  </Td>
                  <Td>
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      variant="outline"
                      aria-label="Delete Attachment"
                      onClick={() => handleDeleteAttachment(projectFile)}
                    />
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Flex>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Submission
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure you want to submit?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCancelSubmit}>
                Cancel
              </Button>
              <Button colorScheme="teal" type="submit" ml={3}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default ProjectOverview;
