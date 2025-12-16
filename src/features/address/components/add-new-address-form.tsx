"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Building2Icon,
  FlagIcon,
  Hash,
  HomeIcon,
  Loader2,
  Map,
  Navigation,
  Phone,
  Save,
  School2Icon,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AddressSchema, AddressSchemaType } from "../schemas/schema";
import { addNewAddress, updateAddress } from "../actions/action";
import { toast } from "sonner";
import { Address } from "@/generated/prisma/client";

const PlaceLabel = [
  {
    icon: HomeIcon,
    text: "Home",
  },
  {
    icon: Building2Icon,
    text: "Office",
  },
  {
    icon: School2Icon,
    text: "School",
  },
  {
    icon: School2Icon,
    text: "Apartment",
  },
  {
    icon: School2Icon,
    text: "Dorm",
  },
  {
    icon: FlagIcon,
    text: "Lainnya",
  },
];

type Location = {
  id: number;
  name: string;
};

interface AddNewAddressFormProps {
  address?: Address;
}

export function AddNewAddressForm({ address }: AddNewAddressFormProps) {
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [cities, setCities] = useState<Location[]>([]);
  const [subdistricts, setSubdistricts] = useState<Location[]>([]);

  const form = useForm<AddressSchemaType>({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      receiver_name: address?.receiverName || "",
      phone_number: address?.phoneNumber || "",
      province: address?.province || "",
      province_id: address?.provinceId || "",
      city: address?.city || "",
      city_id: address?.cityId || "",
      subdistrict: address?.subdistrict || "",
      subdistrict_id: address?.subdistrictId || "",
      complete_address: address?.completeAddress || "",
      postal_code: address?.postalCode || "",
      main_address: address?.mainAddress || false,
      label: address?.label || "",
    },
  });

  const provinceId = form.watch("province_id");
  const cityId = form.watch("city_id");
  const isMainAddress = form.watch("main_address");

  const onSubmit = async (data: AddressSchemaType) => {
    try {
      const { success, message } = address
        ? await updateAddress(data, address.id)
        : await addNewAddress(data);

      if (success) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("/api/rajaongkir/getProvinces", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch province data");
        }

        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (provinceId) {
      (async () => {
        try {
          const response = await fetch(
            "/api/rajaongkir/getCities?provinceId=" + provinceId,
            {
              method: "GET",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch city data");
          }

          const data = await response.json();
          setCities(data);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [provinceId]);

  useEffect(() => {
    if (cityId) {
      (async () => {
        try {
          const response = await fetch(
            "/api/rajaongkir/getSubdistrict?cityId=" + cityId,
            {
              method: "GET",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch subdistrict data");
          }

          const data = await response.json();
          setSubdistricts(data);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [cityId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto p-1"
    >
      <Card className="border shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="overflow-y-auto max-h-[50vh] px-1 pr-2">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4" /> Personal Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="receiver_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Receiver Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...field}
                                placeholder="e.g. John Doe"
                                className="pl-9 bg-background/50 focus:bg-background transition-colors"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...field}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  const phoneNumberRegex = newValue.replace(
                                    /[^0-9]/g,
                                    ""
                                  );
                                  field.onChange(phoneNumberRegex);
                                }}
                                maxLength={12}
                                placeholder="e.g. 08123456789"
                                className="pl-9 bg-background/50 focus:bg-background transition-colors"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Location Details Section */}
                <div className="space-y-4 mt-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mt-2">
                    <Map className="w-4 h-4" /> Location Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province</FormLabel>
                          <Select
                            defaultValue={field.value}
                            onValueChange={(e) => {
                              field.onChange(e);
                              const getProvinceId = provinces.find(
                                (item) => item.name === e
                              );
                              form.setValue(
                                "province_id",
                                getProvinceId?.id!.toString()!
                              );
                              form.setValue("city", "");
                              form.setValue("city_id", "");
                              form.setValue("subdistrict", "");
                              form.setValue("subdistrict_id", "");
                            }}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-background/50 focus:bg-background transition-colors">
                                <SelectValue placeholder="Select Province" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {provinces.map((item) => (
                                <SelectItem key={item.id} value={item.name}>
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <Select
                            defaultValue={field.value}
                            onValueChange={(e) => {
                              field.onChange(e);
                              const getCityId = cities.find(
                                (item) => item.name === e
                              );
                              form.setValue(
                                "city_id",
                                getCityId?.id!.toString()!
                              );
                              form.setValue("subdistrict", "");
                              form.setValue("subdistrict_id", "");
                            }}
                            disabled={!provinceId}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-background/50 focus:bg-background transition-colors">
                                <SelectValue placeholder="Select City" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {cities.map((item) => (
                                <SelectItem key={item.id} value={item.name}>
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subdistrict"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subdistrict</FormLabel>
                          <Select
                            defaultValue={field.value}
                            onValueChange={(e) => {
                              field.onChange(e);
                              const getSubdistrictId = subdistricts.find(
                                (item) => item.name === e
                              );
                              form.setValue(
                                "subdistrict_id",
                                getSubdistrictId?.id!.toString()!
                              );
                            }}
                            disabled={!cityId}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-background/50 focus:bg-background transition-colors">
                                <SelectValue placeholder="Select Subdistrict" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subdistricts.map((item) => (
                                <SelectItem key={item.id} value={item.name}>
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="postal_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Hash className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="text"
                                {...field}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  const phoneNumberRegex = newValue.replace(
                                    /[^0-9]/g,
                                    ""
                                  );

                                  if (isNaN(Number(phoneNumberRegex))) return;

                                  field.onChange(String(phoneNumberRegex));
                                }}
                                placeholder="e.g. 12345"
                                maxLength={5}
                                className="pl-9 bg-background/50 focus:bg-background transition-colors"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 pt-2">
                    <FormField
                      control={form.control}
                      name="label"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Label as</FormLabel>
                          <Select
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-background/50 focus:bg-background transition-colors">
                                <SelectValue placeholder="Select location type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PlaceLabel.map((item) => (
                                <SelectItem key={item.text} value={item.text}>
                                  <div className="flex items-center gap-2">
                                    <item.icon className="w-4 h-4 text-muted-foreground" />
                                    <span>{item.text}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="complete_address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complete Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Navigation className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Textarea
                                {...field}
                                placeholder="Street name, building, house number, etc."
                                className="pl-9 min-h-[100px] resize-none bg-background/50 focus:bg-background transition-colors"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
                <div className="flex items-center space-x-2 bg-muted/30 px-4 py-2 rounded-lg border">
                  <Checkbox
                    id="main_address"
                    checked={isMainAddress}
                    onCheckedChange={(e) =>
                      form.setValue("main_address", e as boolean)
                    }
                    disabled={address?.mainAddress}
                  />
                  <label
                    htmlFor="main_address"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Set as main address
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full sm:w-auto min-w-[150px] shadow-lg hover:shadow-xl transition-all"
                  disabled={
                    form.formState.isSubmitting || !form.formState.isValid
                  }
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : address ? (
                    <>
                      <Save className="w-4 h-4 mr-2" /> Update Address
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" /> Save Address
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
