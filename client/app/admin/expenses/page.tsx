"use client"

import Chakra from "@/app/components/Chakra"
import Providers from "@/app/components/Providers"
import { Flex } from "@chakra-ui/react"

const Expenses = () => {
  return (
    <Flex>
        <Providers>
          <Chakra>
            <Flex style={{ display: "flex" }}>
              <Flex mt={20}>
                Expenses Page
              </Flex>
            </Flex>
          </Chakra>
        </Providers>
    </Flex>
  )
}
export default Expenses