# Swagger\Client\ApplicationFlaggedSetsApi

All URIs are relative to */*

Method | HTTP request | Description
------------- | ------------- | -------------
[**callList**](ApplicationFlaggedSetsApi.md#calllist) | **GET** /applicationFlaggedSets | List application flagged sets
[**resolve**](ApplicationFlaggedSetsApi.md#resolve) | **POST** /applicationFlaggedSets/resolve | Resolve application flagged set
[**retrieve**](ApplicationFlaggedSetsApi.md#retrieve) | **GET** /applicationFlaggedSets/{afsId} | Retrieve application flagged set by id

# **callList**
> \Swagger\Client\Model\PaginatedApplicationFlaggedSetDto callList($listing_id, $page, $limit)

List application flagged sets

### Example
```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');
    // Configure HTTP bearer authorization: bearer
    $config = Swagger\Client\Configuration::getDefaultConfiguration()
    ->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new Swagger\Client\Api\ApplicationFlaggedSetsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$listing_id = "listing_id_example"; // string | 
$page = 1; // float | 
$limit = 10; // float | 

try {
    $result = $apiInstance->callList($listing_id, $page, $limit);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ApplicationFlaggedSetsApi->callList: ', $e->getMessage(), PHP_EOL;
}
?>
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **listing_id** | **string**|  |
 **page** | **float**|  | [optional] [default to 1]
 **limit** | **float**|  | [optional] [default to 10]

### Return type

[**\Swagger\Client\Model\PaginatedApplicationFlaggedSetDto**](../Model/PaginatedApplicationFlaggedSetDto.md)

### Authorization

[bearer](../../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

# **resolve**
> \Swagger\Client\Model\ApplicationFlaggedSetDto resolve($body)

Resolve application flagged set

### Example
```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');
    // Configure HTTP bearer authorization: bearer
    $config = Swagger\Client\Configuration::getDefaultConfiguration()
    ->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new Swagger\Client\Api\ApplicationFlaggedSetsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$body = new \Swagger\Client\Model\ApplicationFlaggedSetResolveDto(); // \Swagger\Client\Model\ApplicationFlaggedSetResolveDto | 

try {
    $result = $apiInstance->resolve($body);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ApplicationFlaggedSetsApi->resolve: ', $e->getMessage(), PHP_EOL;
}
?>
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**\Swagger\Client\Model\ApplicationFlaggedSetResolveDto**](../Model/ApplicationFlaggedSetResolveDto.md)|  |

### Return type

[**\Swagger\Client\Model\ApplicationFlaggedSetDto**](../Model/ApplicationFlaggedSetDto.md)

### Authorization

[bearer](../../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

# **retrieve**
> \Swagger\Client\Model\ApplicationFlaggedSetDto retrieve($afs_id)

Retrieve application flagged set by id

### Example
```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');
    // Configure HTTP bearer authorization: bearer
    $config = Swagger\Client\Configuration::getDefaultConfiguration()
    ->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new Swagger\Client\Api\ApplicationFlaggedSetsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$afs_id = "afs_id_example"; // string | 

try {
    $result = $apiInstance->retrieve($afs_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ApplicationFlaggedSetsApi->retrieve: ', $e->getMessage(), PHP_EOL;
}
?>
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **afs_id** | **string**|  |

### Return type

[**\Swagger\Client\Model\ApplicationFlaggedSetDto**](../Model/ApplicationFlaggedSetDto.md)

### Authorization

[bearer](../../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

