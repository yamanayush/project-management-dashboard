"use client"

import Chakra from "@/app/components/Chakra"
import Providers from "@/app/components/Providers"
import { Flex } from "@chakra-ui/react"

const CostManagement = () => {
  return (
    <div>
        <Providers>
          <Chakra>
            <div style={{ display: "flex" }}>
              <Flex mt={20}>Cost Management Page</Flex>
            </div>
          </Chakra>
        </Providers>
    </div>
  )
}
export default CostManagement