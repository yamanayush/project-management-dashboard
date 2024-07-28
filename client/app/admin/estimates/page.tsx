"use client"

import Chakra from "@/app/components/Chakra"
import Providers from "@/app/components/Providers"
import { Flex } from "@chakra-ui/react"

// import { Metadata } from 'next';
 
// export const metadata: Metadata = {
//   title: 'Estimates',
// };

const Estimates = () => {
  return (
    <Flex>
        <Providers>
          <Chakra>
            <Flex style={{ display: "flex" }}>
              <Flex mt={20}>
                Estimates Page
              </Flex>
            </Flex>
          </Chakra>
        </Providers>
    </Flex>
  )
}
export default Estimates