# ListingCreateDto

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | [**\Swagger\Client\Model\ListingStatus**](ListingStatus.md) |  | 
**display_waitlist_size** | **bool** |  | 
**csv_formatting_type** | [**\Swagger\Client\Model\CSVFormattingType**](CSVFormattingType.md) |  | 
**county_code** | [**\Swagger\Client\Model\CountyCode**](CountyCode.md) |  | 
**preferences** | [**\Swagger\Client\Model\PreferenceCreateDto[]**](PreferenceCreateDto.md) |  | 
**property** | [**\Swagger\Client\Model\IdDto**](IdDto.md) |  | 
**application_address** | [**AllOfListingCreateDtoApplicationAddress**](AllOfListingCreateDtoApplicationAddress.md) |  | 
**application_pick_up_address** | [**AllOfListingCreateDtoApplicationPickUpAddress**](AllOfListingCreateDtoApplicationPickUpAddress.md) |  | 
**leasing_agent_address** | [**AllOfListingCreateDtoLeasingAgentAddress**](AllOfListingCreateDtoLeasingAgentAddress.md) |  | 
**leasing_agents** | [**\Swagger\Client\Model\IdDto[]**](IdDto.md) |  | [optional] 
**application_methods** | [**\Swagger\Client\Model\ApplicationMethodDto[]**](ApplicationMethodDto.md) |  | 
**assets** | [**\Swagger\Client\Model\AssetDto[]**](AssetDto.md) |  | 
**events** | [**\Swagger\Client\Model\ListingEventDto[]**](ListingEventDto.md) |  | 
**application_due_date** | [**\DateTime**](\DateTime.md) |  | 
**application_open_date** | [**\DateTime**](\DateTime.md) |  | 
**application_fee** | **string** |  | 
**application_organization** | **string** |  | 
**application_pick_up_address_office_hours** | **string** |  | 
**building_selection_criteria** | **string** |  | 
**costs_not_included** | **string** |  | 
**credit_history** | **string** |  | 
**criminal_background** | **string** |  | 
**deposit_min** | **string** |  | 
**deposit_max** | **string** |  | 
**disable_units_accordion** | **bool** |  | 
**leasing_agent_email** | **string** |  | 
**leasing_agent_name** | **string** |  | 
**leasing_agent_office_hours** | **string** |  | 
**leasing_agent_phone** | **string** |  | 
**leasing_agent_title** | **string** |  | 
**name** | **string** |  | 
**postmarked_applications_received_by_date** | [**\DateTime**](\DateTime.md) |  | 
**program_rules** | **string** |  | 
**rental_assistance** | **string** |  | 
**rental_history** | **string** |  | 
**required_documents** | **string** |  | 
**special_notes** | **string** |  | [optional] 
**waitlist_current_size** | **float** |  | 
**waitlist_max_size** | **float** |  | 
**what_to_expect** | [**AllOfListingCreateDtoWhatToExpect**](AllOfListingCreateDtoWhatToExpect.md) |  | 
**application_config** | **object** |  | [optional] 

[[Back to Model list]](../../README.md#documentation-for-models) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to README]](../../README.md)

