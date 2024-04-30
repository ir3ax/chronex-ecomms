import { Input } from '../../../../../../components/input';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem } from '../../../../../../components/ui/form';
import { SaveOrderRequest } from '../../../../../../service/order/schema';
import { barangaySelect, citySelect, provinceSelect, regionSelect } from '../../../../../../atom/checkOutAtom';
import { useAtom } from 'jotai';
import { places } from '../../../../../../utility/places';

export const AddAddressModal = () => {

  const [selectedRegion, setSelectedRegion] = useAtom(regionSelect);
  const [selectedProvince, setSelectedProvince] = useAtom(provinceSelect);
  const [selectedCity, setSelectedCity] = useAtom(citySelect);
  const [selectedBarangay, setSelectedBarangay] = useAtom(barangaySelect);
  
  const orderForm = useFormContext<SaveOrderRequest>()

  return (
    <div className='w-full pb-8'> 
      <div className='w-full  flex  justify-start items-start'>
        <h1 className='text-lg'>Address Details:</h1>
      </div>
      <div className='mt-6 w-full flex gap-6'>
        <div className='flex flex-1 flex-col gap-6'>
          <div className='w-[100%] flex flex-col gap-2'>
            <label>Address</label>
            <FormField
                control={orderForm.control}
                name='completeAddress.address'
                render={({ field, fieldState }) => (
                    <FormItem className='col-span-full'>
                        <FormControl>
                        <Input 
                          id='completeAddress.address'
                          className='focus-visible:ring-[#63B38F]' 
                          placeholder='Address'
                          type='text'
                          ref={field.ref}
                          name={field.name}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                        />
                        </FormControl>
                        <FormDescription className='text-red-500'>
                            {fieldState.error?.message}
                        </FormDescription>
                    </FormItem>
                )}
            />
          </div>
          <div className='w-[100%] flex flex-col gap-2'>
            <label>House Number</label>
            <FormField
                control={orderForm.control}
                name='completeAddress.houseNumber'
                render={({ field, fieldState }) => (
                    <FormItem className='col-span-full'>
                        <FormControl>
                        <Input 
                          id='completeAddress.houseNumber'
                          className='focus-visible:ring-[#63B38F]' 
                          placeholder='House Number'
                          type='text'
                          ref={field.ref}
                          name={field.name}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                        />
                        </FormControl>
                        <FormDescription className='text-red-500'>
                            {fieldState.error?.message}
                        </FormDescription>
                    </FormItem>
                )}
            />
          </div>
          <div className='w-[100%] flex flex-col gap-2'>
            <label>Landmark</label>
            <FormField
                control={orderForm.control}
                name='completeAddress.landMark'
                render={({ field, fieldState }) => (
                    <FormItem className='col-span-full'>
                        <FormControl>
                        <Input 
                          id='completeAddress.landMark'
                          className='focus-visible:ring-[#63B38F]' 
                          placeholder='Land Mark'
                          type='text'
                          ref={field.ref}
                          name={field.name}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                        />
                        </FormControl>
                        <FormDescription className='text-red-500'>
                            {fieldState.error?.message}
                        </FormDescription>
                    </FormItem>
                )}
            />
          </div>

          <div className='w-full flex gap-4'>
            <div className='w-[100%] flex flex-col gap-2'>
              <label>Region</label>
              <FormField
                  control={orderForm.control}
                  name='completeAddress.region'
                  render={({ field, fieldState }) => (
                      <FormItem className='col-span-full'>
                          <FormControl>
                          <select
                              id='completeAddress.region'
                              className='flex w-full h-[40px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                              value={selectedRegion}
                              ref={field.ref}
                              name={field.name}
                              onChange={(e) => {
                              setSelectedRegion(e.target.value);
                              setSelectedProvince('');
                              setSelectedCity('');
                              setSelectedBarangay('');
                              }}
                            >
                              <option value='' disabled>
                              Select Region
                              </option>
                              {Object.entries(places).map(([regionKey, region]) => (
                              <option key={regionKey} value={regionKey}>
                                  {region.region_name}
                              </option>
                              ))}
                            </select> 
                          </FormControl>
                          <FormDescription className='text-red-500'>
                              {fieldState.error?.message}
                          </FormDescription>
                      </FormItem>
                  )}
              />
            </div>
            <div className='w-[100%] flex flex-col gap-2'>
              <label>Province</label>
              <FormField
                  control={orderForm.control}
                  name='completeAddress.province'
                  render={({ field, fieldState }) => (
                      <FormItem className='col-span-full'>
                          <FormControl>
                          <select
                              id='completeAddress.province'
                              className='flex w-full h-[40px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                              value={selectedProvince}
                              ref={field.ref}
                              name={field.name}
                              onChange={(e) => {
                              setSelectedProvince(e.target.value);
                              setSelectedCity('');
                              setSelectedBarangay('');
                              }}
                              disabled={!selectedRegion}
                          >
                              <option value='' disabled>
                              Select Province
                              </option>
                              {selectedRegion &&
                              places[selectedRegion]?.province_list &&
                              Object.keys(places[selectedRegion]?.province_list ?? {}).map((province) => (
                                  <option key={province} value={province}>
                                  {province}
                                  </option>
                              ))}
                          </select>
                          </FormControl>
                          <FormDescription className='text-red-500'>
                              {fieldState.error?.message}
                          </FormDescription>
                      </FormItem>
                  )}
              />
            </div>
          </div>
          <div className='w-full flex gap-4'>
            <div className='w-[100%] flex flex-1 flex-col gap-2'>
              <label>City</label>
              <FormField
                  control={orderForm.control}
                  name='completeAddress.city'
                  render={({ field, fieldState }) => (
                      <FormItem className='col-span-full'>
                          <FormControl>
                          <select
                            id='completeAddress.city'
                            className='flex w-full h-[40px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                            value={selectedCity}
                            ref={field.ref}
                            name={field.name}
                            onChange={(e) => {
                            setSelectedCity(e.target.value);
                            setSelectedBarangay('');
                            }}
                            disabled={!selectedRegion || !selectedProvince}
                        >
                            <option value='' disabled>
                            Select City/Municipality
                            </option>
                            {selectedRegion &&
                            selectedProvince &&
                            places[selectedRegion]?.province_list?.[selectedProvince]?.municipality_list &&
                            Object.keys(places[selectedRegion]?.province_list[selectedProvince]?.municipality_list ?? {}).map((city) => (
                                <option key={city} value={city}>
                                {city}
                                </option>
                            ))}
                        </select>
                          </FormControl>
                          <FormDescription className='text-red-500'>
                              {fieldState.error?.message}
                          </FormDescription>
                      </FormItem>
                  )}
              />
            </div>
            <div className='w-[100%] flex flex-1 flex-col gap-2'>
              <label>Barangay</label>
              <FormField
                  control={orderForm.control}
                  name='completeAddress.barangay'
                  render={({ field, fieldState }) => (
                      <FormItem className='col-span-full'>
                          <FormControl>
                          <select
                            id='completeAddress.barangay'
                            className='flex w-full h-[40px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                            value={selectedBarangay}
                            ref={field.ref}
                            name={field.name}
                            onChange={(e) => setSelectedBarangay(e.target.value)}
                            disabled={!selectedRegion || !selectedProvince || !selectedCity}
                        >
                            <option value='' disabled>
                            Select Barangay
                            </option>
                            {selectedRegion &&
                            selectedProvince &&
                            selectedCity &&
                            places[selectedRegion]?.province_list?.[selectedProvince]?.municipality_list?.[selectedCity]?.barangay_list?.map(
                                (barangay) => (
                                <option key={barangay} value={barangay}>
                                    {barangay}
                                </option>
                                )
                            )}
                        </select>
                          </FormControl>
                          <FormDescription className='text-red-500'>
                              {fieldState.error?.message}
                          </FormDescription>
                      </FormItem>
                  )}
              />
            </div>
          </div>    
        
        </div>
      </div>
    </div>
  );
}
