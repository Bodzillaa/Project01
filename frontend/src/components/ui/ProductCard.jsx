/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Box,
  Image,
  Heading,
  Text,
  HStack,
  IconButton,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useProductStore } from "../../store/product";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const textColor = useColorModeValue("gray.600", "gray.200");
  const bg = useColorModeValue("white", "gray.800");

  const { updateProduct, deleteProduct } = useProductStore();

  // EDIT FUNCTIONALITY

  const [open, setOpen] = useState(false);

  const [updatedProduct, setUpdatedProduct] = useState(product);

  const handleUpdateProduct = async (pid, updatedProduct) => {
    try {
      const { success, message } = await updateProduct(pid, updatedProduct);
      setOpen(false);

      if (success) {
        toaster.create({
          title: "Success",
          description: message,
          type: "success",
        });
      } else {
        toaster.create({
          title: "Failed",
          description: message,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update the product. Please try again.");
    }
  };

  // DELETE FUNCTIONALITY

  const handleDelete = async (pid) => {
    try {
      const { success, message } = await deleteProduct(pid);
      if (success) {
        toaster.create({
          title: "Success",
          description: message,
          type: "success",
        });
      } else {
        toaster.create({
          title: "Failed",
          description: message,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to delete the product. Please try again.");
    }
  };

  return (
    <Box
      shadow={"lg"}
      rounded={"lg"}
      overflow={"hidden"}
      transition={"all 0.3s"}
      _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
      bg={bg}
    >
      <Image
        src={product.image}
        alt={product.name}
        w={"full"}
        h={"300px"}
        objectFit={"cover"}
      />
      <Box p={4}>
        <Heading as={"h3"} size={"md"} mb={2}>
          {product.name}
        </Heading>
        <Text fontWeight={"bold"} fontSize={"xl"} color={textColor} mb={4}>
          ${product.price}
        </Text>

        <HStack spacing={2}>
          {/* EDIT BUTTON */}

          <DialogRoot
            lazyMount
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
          >
            <DialogTrigger asChild>
              <IconButton colorPalette={"blue"}>
                <FaEdit />
              </IconButton>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update this Product</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <VStack gap={5}>
                  <Input
                    placeholder="Update Product Name"
                    name="name"
                    value={updatedProduct.name}
                    onChange={(e) =>
                      setUpdatedProduct({
                        ...updatedProduct,
                        name: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Update Product Price"
                    name="price"
                    type="number"
                    value={updatedProduct.price}
                    onChange={(e) =>
                      setUpdatedProduct({
                        ...updatedProduct,
                        price: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Update Product Image"
                    name="image"
                    value={updatedProduct.image}
                    onChange={(e) =>
                      setUpdatedProduct({
                        ...updatedProduct,
                        image: e.target.value,
                      })
                    }
                  />
                </VStack>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogActionTrigger>
                <Button
                  colorPalette={"blue"}
                  onClick={() =>
                    handleUpdateProduct(product._id, updatedProduct)
                  }
                >
                  Update
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>

          {/* DELETE BUTTON */}
          <IconButton
            colorPalette={"red"}
            onClick={() => handleDelete(product._id)}
          >
            <MdDeleteForever />
          </IconButton>
        </HStack>
      </Box>
    </Box>
  );
};

export default ProductCard;
