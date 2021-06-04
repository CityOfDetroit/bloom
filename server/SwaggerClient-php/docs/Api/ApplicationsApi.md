# Swagger\Client\ApplicationsApi

All URIs are relative to */*

Method | HTTP request | Description
------------- | ------------- | -------------
[**callList**](ApplicationsApi.md#calllist) | **GET** /applications | List applications
[**create**](ApplicationsApi.md#create) | **POST** /applications | Create application
[**delete**](ApplicationsApi.md#delete) | **DELETE** /applications/{applicationId} | Delete application by id
[**listAsCsv**](ApplicationsApi.md#listascsv) | **GET** /applications/csv | List applications as csv
[**retrieve**](ApplicationsApi.md#retrieve) | **GET** /applications/{applicationId} | Get application by id
[**submit**](ApplicationsApi.md#submit) | **POST** /applications/submit | Submit application
[**update**](ApplicationsApi.md#update) | **PUT** /applications/{applicationId} | Update application by id

# **callList**
> \Swagger\Client\Model\PaginatedApplicationDto callList($page, $limit, $listing_id, $search, $user_id, $order_by, $order, $marked_as_duplicate)

List applications

### Example
```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');
    // Configure HTTP bearer authorization: bearer
    $config = Swagger\Client\Configuration::getDefaultConfiguration()
    ->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new Swagger\Client\Api\ApplicationsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$page = 1; // float | 
$limit = 10; // float | 
$listing_id = "listing_id_example"; // string | 
$search = "search_example"; // string | 
$user_id = "user_id_example"; // string | 
$order_by = "createdAt"; // string | 
$order = "DESC"; // string | 
$marked_as_duplicate = true; // bool | 

try {
    $result = $apiInstance->callList($page, $limit, $listing_id, $search, $user_id, $order_by, $order, $marked_as_duplicate);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ApplicationsApi->callList: ', $e->getMessage(), PHP_EOL;
}
?>
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **float**|  | [optional] [default to 1]
 **limit** | **float**|  | [optional] [default to 10]
 **listing_id** | **string**|  | [optional]
 **search** | **string**|  | [optional]
 **user_id** | **string**|  | [optional]
 **order_by** | **string**|  | [optional] [default to createdAt]
 **order** | **string**|  | [optional] [default to DESC]
 **marked_as_duplicate** | **bool**|  | [optional]

### Return type

[**\Swagger\Client\Model\PaginatedApplicationDto**](../Model/PaginatedApplicationDto.md)

### Authorization

[bearer](../../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

# **create**
> \Swagger\Client\Model\ApplicationDto create($body)

Create application

### Example
```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');
    // Configure HTTP bearer authorization: bearer
    $config = Swagger\Client\Configuration::getDefaultConfiguration()
    ->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new Swagger\Client\Api\ApplicationsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$body = new \Swagger\Client\Model\ApplicationCreateDto(); // \Swagger\Client\Model\ApplicationCreateDto | 

try {
    $result = $apiInstance->create($body);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ApplicationsApi->create: ', $e->getMessage(), PHP_EOL;
}
?>
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**\Swagger\Client\Model\ApplicationCreateDto**](../Model/ApplicationCreateDto.md)|  |

### Return type

[**\Swagger\Client\Model\ApplicationDto**](../Model/ApplicationDto.md)

### Authorization

[bearer](../../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

# **delete**
> delete($application_id)

Delete application by id

### Example
```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');
    // Configure HTTP bearer authorization: bearer
    $config = Swagger\Client\Configuration::getDefaultConfiguration()
    ->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new Swagger\Client\Api\ApplicationsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$application_id = "application_id_example"; // string | 

try {
    $apiInstance->delete($application_id);
} catch (Exception $e) {
    echo 'Exception when calling ApplicationsApi->delete: ', $e->getMessage(), PHP_EOL;
}
?>
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **application_id** | **string**|  |

### Return type

void (empty response body)

### Authorization

[bearer](../../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

# **listAsCsv**
> string listAsCsv($page, $limit, $listing_id, $search, $user_id, $order_by, $order, $marked_as_duplicate, $include_headers, $include_demographics)

List applications as csv

### Example
```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');
    // Configure HTTP bearer authorization: bearer
    $config = Swagger\Client\Configuration::getDefaultConfiguration()
    ->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new Swagger\Client\Api\ApplicationsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$page = 1; // float | 
$limit = 10; // float | 
$listing_id = "listing_id_example"; // string | 
$search = "search_example"; // string | 
$user_id = "user_id_example"; // string | 
$order_by = "createdAt"; // string | 
$order = "DESC"; // string | 
$marked_as_duplicate = true; // bool | 
$include_headers = true; // bool | 
$include_demographics = true; // bool | 

try {
    $result = $apiInstance->listAsCsv($page, $limit, $listing_id, $search, $user_id, $order_by, $order, $marked_as_duplicate, $include_headers, $include_demographics);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ApplicationsApi->listAsCsv: ', $e->getMessage(), PHP_EOL;
}
?>
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **float**|  | [optional] [default to 1]
 **limit** | **float**|  | [optional] [default to 10]
 **listing_id** | **string**|  | [optional]
 **search** | **string**|  | [optional]
 **user_id** | **string**|  | [optional]
 **order_by** | **string**|  | [optional] [default to createdAt]
 **order** | **string**|  | [optional] [default to DESC]
 **marked_as_duplicate** | **bool**|  | [optional]
 **include_headers** | **bool**|  | [optional]
 **include_demographics** | **bool**|  | [optional]

### Return type

**string**

### Authorization

[bearer](../../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

# **retrieve**
> \Swagger\Client\Model\ApplicationDto retrieve($application_id)

Get application by id

### Example
```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');
    // Configure HTTP bearer authorization: bearer
    $config = Swagger\Client\Configuration::getDefaultConfiguration()
    ->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new Swagger\Client\Api\ApplicationsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$application_id = "application_id_example"; // string | 

try {
    $result = $apiInstance->retrieve($application_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ApplicationsApi->retrieve: ', $e->getMessage(), PHP_EOL;
}
?>
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **application_id** | **string**|  |

### Return type

[**\Swagger\Client\Model\ApplicationDto**](../Model/ApplicationDto.md)

### Authorization

[bearer](../../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

# **submit**
> \Swagger\Client\Model\ApplicationDto submit($body)

Submit application

### Example
```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');
    // Configure HTTP bearer authorization: bearer
    $config = Swagger\Client\Configuration::getDefaultConfiguration()
    ->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new Swagger\Client\Api\ApplicationsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$body = new \Swagger\Client\Model\ApplicationCreateDto(); // \Swagger\Client\Model\ApplicationCreateDto | 

try {
    $result = $apiInstance->submit($body);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ApplicationsApi->submit: ', $e->getMessage(), PHP_EOL;
}
?>
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**\Swagger\Client\Model\ApplicationCreateDto**](../Model/ApplicationCreateDto.md)|  |

### Return type

[**\Swagger\Client\Model\ApplicationDto**](../Model/ApplicationDto.md)

### Authorization

[bearer](../../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

# **update**
> \Swagger\Client\Model\ApplicationDto update($body, $application_id)

Update application by id

### Example
```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');
    // Configure HTTP bearer authorization: bearer
    $config = Swagger\Client\Configuration::getDefaultConfiguration()
    ->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new Swagger\Client\Api\ApplicationsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$body = new \Swagger\Client\Model\ApplicationUpdateDto(); // \Swagger\Client\Model\ApplicationUpdateDto | 
$application_id = "application_id_example"; // string | 

try {
    $result = $apiInstance->update($body, $application_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ApplicationsApi->update: ', $e->getMessage(), PHP_EOL;
}
?>
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**\Swagger\Client\Model\ApplicationUpdateDto**](../Model/ApplicationUpdateDto.md)|  |
 **application_id** | **string**|  |

### Return type

[**\Swagger\Client\Model\ApplicationDto**](../Model/ApplicationDto.md)

### Authorization

[bearer](../../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

