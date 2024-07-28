"use client"

import { Flex } from "@chakra-ui/react"
import Chakra from "../components/Chakra"
import Providers from "../components/Providers"


const Admin = () => {
  return (
    <Flex>
        <Providers>
          <Chakra>
            <Flex style={{ display: "flex" }}>
              <Flex mt={20}>
                Admin Home Page
              </Flex>
            </Flex>
          </Chakra>
        </Providers>
    </Flex>
  )
}
export default Admin