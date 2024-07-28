"use client";

import { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  CheckboxGroup,
  Checkbox,
  Button,
  Select,
  VStack,
  HStack,
  Text,
  Grid,
  useToast,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Chakra from "@/app/components/Chakra";
import Providers from "@/app/components/Providers";
import Navbar from "@/app/components/NavbarForms";
import MaskedInput from "react-text-mask";

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
  Creation_Date: string;
  Proposed_Start_Date: string;
  Proposed_Project_Completion_Date: string;
  Project_Disciplines_Engineering: string[];
  Project_Disciplines_Design_Drafting: string[];
  Project_Type: string;
  Status: string;
  "As of date:": string;
  "Total Approved Budget:": number;
  "Original PO Value:": number;
  "Expenses: (ABSA Fees, TSSA fees, etc.):": number;
  "Approx. hours remaining (based on blended rate of $120/hour)": number;
  "Remaining Budget:": number;
  Contractors: string[];
  // ProjectAttachments: File[];
}

const RequestForQuotation = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedDisciplinesEng, setSelectedDisciplinesEng] = useState<
    string[]
  >([]);
  const [
    selectedDisciplinesDesDraft,
    setSelectedDisciplinesDesDraft,
  ] = useState<string[]>([]);

  const toast = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const selectedFiles = Array.from(fileList);
      setFiles([...files, ...selectedFiles]);
    }
  };

  const handleRemoveFile = (index: any) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  const phoneNumberMask = [
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];

  const renderUploadedFiles = () => {
    if (files.length === 0) {
      return null;
    }

    return (
      <VStack align="start" mt={2}>
        <Text>Uploaded Files:</Text>
        {files.map((file, index) => (
          <Flex key={index} align="flex">
            <Text>{file.name}</Text>
            <Button
              size="sm"
              colorScheme="white"
              onClick={() => handleRemoveFile(index)}
              textColor="black"
              _hover={{ backgroundColor: "gray.200" }}
            >
              X
            </Button>
          </Flex>
        ))}
      </VStack>
    );
  };

  let clientName = "";
  let clientEmail = "";
  let clientPhone = "";
  let clientCompany = "";
  let clientAddress = "";
  let projectName = "";
  let projectNumber = "";
  let projStartDate = "";
  let projEndDate = "";
  let projectDescription = "";
  let projectType = "";
  let createdDate = "";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(formRef.current!);

    clientName = formData.get("clientName") as string;
    clientEmail = formData.get("clientEmail") as string;
    clientPhone = formData.get("clientPhone") as string;
    clientCompany = formData.get("clientCompany") as string;
    clientAddress = formData.get("clientAddress") as string;
    projectName = formData.get("projectName") as string;
    projectNumber = formData.get("projectNumber") as string;
    projectDescription = formData.get("projectDescription") as string;
    projStartDate = formData.get("startDate") as string;
    projEndDate = formData.get("endDate") as string;
    projectType = formData.get("projectType") as string;
    createdDate = new Date().toISOString().slice(0, 10);

    // Rest of the form fields

    if (files.length > 0) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }

    console.log("Project Disciplines (Engineering): ", selectedDisciplinesEng);
    console.log(
      "Project Disciplines (Design & Drafting): ",
      selectedDisciplinesDesDraft
    );

    console.log("Project Files:", files);

    const projectData = {
      Project_Number: projectNumber,
      Client_Company_Name: clientCompany,
      Client_Contact_Name: clientName,
      Client_Email: clientEmail,
      Client_Contact_Phone_Number: clientPhone,
      Client_Address: clientAddress,
      Project_Name: projectName,
      Project_Description: projectDescription,
      Creation_Date: createdDate,
      Proposed_Start_Date: startDate,
      Proposed_Project_Completion_Date: endDate,
      Project_Disciplines_Engineering: selectedDisciplinesEng,
      Project_Disciplines_Design_Drafting: selectedDisciplinesDesDraft,
      Project_Type: projectType,
      Status: "Request",
      Contractors: "",
      // ProjectAttachments: files,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/projects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(projectData),
        }
      );

      toast({
        title: "Project Created!",
        description: `The request for "${projectName}" has been successfully submitted.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch {
      console.log("error");
    }

    // Reset form fields and variables
    formRef.current?.reset();
    clientName = "";
    clientEmail = "";
    clientPhone = "";
    clientCompany = "";
    clientAddress = "";
    projectName = "";
    projectNumber = "";
    projectDescription = "";
    projectType = "";
    projStartDate = "";
    projEndDate = "";
    setEndDate(null);
    setStartDate(null);
    setSelectedDisciplinesEng([]);
    setSelectedDisciplinesDesDraft([]);
    setFiles([]);
    console.log(selectedDisciplinesDesDraft);
    console.log(selectedDisciplinesEng);

    // Perform form submission or other actions
    // ...
  };

  return (
    <Chakra>
      <Providers>
        <Navbar />
        <Flex direction="column" align="center" justify="center" minH="80vh">
          <Heading mt={40} mb={8}>
            Engineering Project RFQ
          </Heading>

          <Box
            shadow="md"
            borderWidth="1px"
            p={8}
            w="full"
            maxW="1000px"
            mb={10}
          >
            <form ref={formRef} onSubmit={handleSubmit}>
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={8}
              >
                <Box>
                  <FormControl id="clientName" isRequired>
                    <FormLabel>Client Name</FormLabel>
                    <Input name="clientName" placeholder="Client Name" />
                  </FormControl>

                  <FormControl id="clientEmail" mt={4} isRequired>
                    <FormLabel>Client Email</FormLabel>
                    <Input
                      name="clientEmail"
                      placeholder="example@gmail.com"
                      type="email"
                    />
                  </FormControl>

                  <FormControl id="clientPhone" mt={4} isRequired>
                    <FormLabel>Client Phone Number</FormLabel>
                    {/* @ts-ignore */}
                    <MaskedInput
                      mask={phoneNumberMask}
                      name="clientPhone"
                      placeholder="1-403-123-2234"
                      guide={false}
                      id="clientPhone"
                      render={(ref: any, props: any) => (
                        <Input ref={ref} {...props} />
                      )}
                    />
                  </FormControl>

                  <FormControl id="clientCompany" mt={4} isRequired>
                    <FormLabel>Client Company</FormLabel>
                    <Input name="clientCompany" placeholder="Example Inc." />
                  </FormControl>

                  <FormControl id="clientAddress" mt={4} isRequired>
                    <FormLabel>Client Address</FormLabel>
                    <Input
                      name="clientAddress"
                      placeholder="20 Example Way NW, Calgary, AB, Canada"
                    />
                  </FormControl>
                </Box>

                <Box>
                  <FormControl id="projectName" isRequired>
                    <FormLabel>Project Name</FormLabel>
                    <Input name="projectName" placeholder="Project Name" />
                  </FormControl>

                  <FormControl id="projectNumber" mt={4} isRequired>
                    <FormLabel>Project Number</FormLabel>
                    <Input name="projectNumber" placeholder="Project Number" />
                  </FormControl>

                  <FormControl id="projectDescription" mt={4} isRequired>
                    <FormLabel>Project Description</FormLabel>
                    <Textarea
                      name="projectDescription"
                      placeholder="Max 1000 characters"
                      maxLength={1000}
                    />
                  </FormControl>

                  <FormControl id="startDate" mt={4}>
                    <FormLabel>Proposed Start Date</FormLabel>
                    <DatePicker
                      name="startDate"
                      selected={startDate}
                      onChange={(date: Date) => setStartDate(date)}
                      customInput={<Input />}
                      placeholderText="Select Date"
                    />
                  </FormControl>

                  <FormControl id="endDate" mt={4}>
                    <FormLabel>Proposed End Date</FormLabel>
                    <DatePicker
                      name="endDate"
                      selected={endDate}
                      onChange={(date: Date) => setEndDate(date)}
                      customInput={<Input />}
                      placeholderText="Select Date"
                    />
                  </FormControl>

                  {/* <FormControl id="projectAttachments" mt={4}>
                    <FormLabel>Project Attachments</FormLabel>
                    <Button
                      as="label"
                      htmlFor="fileUpload"
                      leftIcon={<SettingsIcon />}
                      cursor="pointer"
                    >
                      Click to Upload
                    </Button>
                    <Input
                      id="fileUpload"
                      type="file"
                      accept=".xls,.xlsx,.xlsm,.csv,.docx,.pdf,.ppt,"
                      multiple
                      onChange={handleFileChange}
                      opacity={0}
                      position="absolute"
                      zIndex="-1"
                    />

                    {renderUploadedFiles()}
                  </FormControl> */}

                  <FormControl id="projectDisciplinesEng" mt={5}>
                    <FormLabel>Project Disciplines (Engineering)</FormLabel>
                    <CheckboxGroup
                      colorScheme="green"
                      value={selectedDisciplinesEng} // Update the value prop
                      onChange={(values: string[]) =>
                        setSelectedDisciplinesEng(values)
                      }
                    >
                      <HStack spacing={5}>
                        <VStack align="start" spacing={1}>
                          <Checkbox value="Mechanical">Mechanical</Checkbox>
                          <Checkbox value="Structural">Structural</Checkbox>
                          <Checkbox value="Instrumentation">
                            Instrumentation
                          </Checkbox>
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
                    <FormLabel>
                      Project Disciplines (Design & Drafting)
                    </FormLabel>
                    <CheckboxGroup
                      colorScheme="green"
                      value={selectedDisciplinesDesDraft}
                      onChange={(values: string[]) =>
                        setSelectedDisciplinesDesDraft(values)
                      }
                    >
                      <HStack spacing={5}>
                        <VStack align="start" spacing={1}>
                          <Checkbox value="Mechanical">Mechanical</Checkbox>
                          <Checkbox value="Structural">Structural</Checkbox>
                          <Checkbox value="Instrumentation">
                            Instrumentation
                          </Checkbox>
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

                  <FormControl id="projectType" mt={4}>
                    <FormLabel>Project Type (Optional)</FormLabel>
                    <Select name="projectType" placeholder="Select Type">
                      <option value="Pre-Feed">Pre-Feed</option>
                      <option value="Feed">Feed</option>
                      <option value="Detailed Design">Detailed Design</option>
                      <option value="Technical Review">Technical Review</option>
                      <option value="Etc.">Etc.</option>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              <Button colorScheme="blue" type="submit" mt={8} marginLeft={850}>
                Submit
              </Button>
            </form>
          </Box>
        </Flex>
      </Providers>
    </Chakra>
  );
};

export default RequestForQuotation;
