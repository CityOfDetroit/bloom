<?php
/**
 * HouseholdMemberUpdateDto
 *
 * PHP version 5
 *
 * @category Class
 * @package  Swagger\Client
 * @author   Swagger Codegen team
 * @link     https://github.com/swagger-api/swagger-codegen
 */

/**
 * Bloom API
 *
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 * Generated by: https://github.com/swagger-api/swagger-codegen.git
 * Swagger Codegen version: 3.0.27-SNAPSHOT
 */
/**
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen
 * Do not edit the class manually.
 */

namespace Swagger\Client\Model;

use \ArrayAccess;
use \Swagger\Client\ObjectSerializer;

/**
 * HouseholdMemberUpdateDto Class Doc Comment
 *
 * @category Class
 * @package  Swagger\Client
 * @author   Swagger Codegen team
 * @link     https://github.com/swagger-api/swagger-codegen
 */
class HouseholdMemberUpdateDto implements ModelInterface, ArrayAccess
{
    const DISCRIMINATOR = null;

    /**
      * The original name of the model.
      *
      * @var string
      */
    protected static $swaggerModelName = 'HouseholdMemberUpdateDto';

    /**
      * Array of property to type mappings. Used for (de)serialization
      *
      * @var string[]
      */
    protected static $swaggerTypes = [
        'id' => 'string',
'created_at' => '\DateTime',
'updated_at' => '\DateTime',
'address' => '\Swagger\Client\Model\AddressUpdateDto',
'work_address' => '\Swagger\Client\Model\AddressUpdateDto',
'order_id' => 'float',
'first_name' => 'string',
'middle_name' => 'string',
'last_name' => 'string',
'birth_month' => 'string',
'birth_day' => 'string',
'birth_year' => 'string',
'email_address' => 'string',
'no_email' => 'bool',
'phone_number' => 'string',
'phone_number_type' => 'string',
'no_phone' => 'bool',
'same_address' => 'string',
'relationship' => 'string',
'work_in_region' => 'string'    ];

    /**
      * Array of property to format mappings. Used for (de)serialization
      *
      * @var string[]
      */
    protected static $swaggerFormats = [
        'id' => null,
'created_at' => 'date-time',
'updated_at' => 'date-time',
'address' => null,
'work_address' => null,
'order_id' => null,
'first_name' => null,
'middle_name' => null,
'last_name' => null,
'birth_month' => null,
'birth_day' => null,
'birth_year' => null,
'email_address' => null,
'no_email' => null,
'phone_number' => null,
'phone_number_type' => null,
'no_phone' => null,
'same_address' => null,
'relationship' => null,
'work_in_region' => null    ];

    /**
     * Array of property to type mappings. Used for (de)serialization
     *
     * @return array
     */
    public static function swaggerTypes()
    {
        return self::$swaggerTypes;
    }

    /**
     * Array of property to format mappings. Used for (de)serialization
     *
     * @return array
     */
    public static function swaggerFormats()
    {
        return self::$swaggerFormats;
    }

    /**
     * Array of attributes where the key is the local name,
     * and the value is the original name
     *
     * @var string[]
     */
    protected static $attributeMap = [
        'id' => 'id',
'created_at' => 'createdAt',
'updated_at' => 'updatedAt',
'address' => 'address',
'work_address' => 'workAddress',
'order_id' => 'orderId',
'first_name' => 'firstName',
'middle_name' => 'middleName',
'last_name' => 'lastName',
'birth_month' => 'birthMonth',
'birth_day' => 'birthDay',
'birth_year' => 'birthYear',
'email_address' => 'emailAddress',
'no_email' => 'noEmail',
'phone_number' => 'phoneNumber',
'phone_number_type' => 'phoneNumberType',
'no_phone' => 'noPhone',
'same_address' => 'sameAddress',
'relationship' => 'relationship',
'work_in_region' => 'workInRegion'    ];

    /**
     * Array of attributes to setter functions (for deserialization of responses)
     *
     * @var string[]
     */
    protected static $setters = [
        'id' => 'setId',
'created_at' => 'setCreatedAt',
'updated_at' => 'setUpdatedAt',
'address' => 'setAddress',
'work_address' => 'setWorkAddress',
'order_id' => 'setOrderId',
'first_name' => 'setFirstName',
'middle_name' => 'setMiddleName',
'last_name' => 'setLastName',
'birth_month' => 'setBirthMonth',
'birth_day' => 'setBirthDay',
'birth_year' => 'setBirthYear',
'email_address' => 'setEmailAddress',
'no_email' => 'setNoEmail',
'phone_number' => 'setPhoneNumber',
'phone_number_type' => 'setPhoneNumberType',
'no_phone' => 'setNoPhone',
'same_address' => 'setSameAddress',
'relationship' => 'setRelationship',
'work_in_region' => 'setWorkInRegion'    ];

    /**
     * Array of attributes to getter functions (for serialization of requests)
     *
     * @var string[]
     */
    protected static $getters = [
        'id' => 'getId',
'created_at' => 'getCreatedAt',
'updated_at' => 'getUpdatedAt',
'address' => 'getAddress',
'work_address' => 'getWorkAddress',
'order_id' => 'getOrderId',
'first_name' => 'getFirstName',
'middle_name' => 'getMiddleName',
'last_name' => 'getLastName',
'birth_month' => 'getBirthMonth',
'birth_day' => 'getBirthDay',
'birth_year' => 'getBirthYear',
'email_address' => 'getEmailAddress',
'no_email' => 'getNoEmail',
'phone_number' => 'getPhoneNumber',
'phone_number_type' => 'getPhoneNumberType',
'no_phone' => 'getNoPhone',
'same_address' => 'getSameAddress',
'relationship' => 'getRelationship',
'work_in_region' => 'getWorkInRegion'    ];

    /**
     * Array of attributes where the key is the local name,
     * and the value is the original name
     *
     * @return array
     */
    public static function attributeMap()
    {
        return self::$attributeMap;
    }

    /**
     * Array of attributes to setter functions (for deserialization of responses)
     *
     * @return array
     */
    public static function setters()
    {
        return self::$setters;
    }

    /**
     * Array of attributes to getter functions (for serialization of requests)
     *
     * @return array
     */
    public static function getters()
    {
        return self::$getters;
    }

    /**
     * The original name of the model.
     *
     * @return string
     */
    public function getModelName()
    {
        return self::$swaggerModelName;
    }

    

    /**
     * Associative array for storing property values
     *
     * @var mixed[]
     */
    protected $container = [];

    /**
     * Constructor
     *
     * @param mixed[] $data Associated array of property values
     *                      initializing the model
     */
    public function __construct(array $data = null)
    {
        $this->container['id'] = isset($data['id']) ? $data['id'] : null;
        $this->container['created_at'] = isset($data['created_at']) ? $data['created_at'] : null;
        $this->container['updated_at'] = isset($data['updated_at']) ? $data['updated_at'] : null;
        $this->container['address'] = isset($data['address']) ? $data['address'] : null;
        $this->container['work_address'] = isset($data['work_address']) ? $data['work_address'] : null;
        $this->container['order_id'] = isset($data['order_id']) ? $data['order_id'] : null;
        $this->container['first_name'] = isset($data['first_name']) ? $data['first_name'] : null;
        $this->container['middle_name'] = isset($data['middle_name']) ? $data['middle_name'] : null;
        $this->container['last_name'] = isset($data['last_name']) ? $data['last_name'] : null;
        $this->container['birth_month'] = isset($data['birth_month']) ? $data['birth_month'] : null;
        $this->container['birth_day'] = isset($data['birth_day']) ? $data['birth_day'] : null;
        $this->container['birth_year'] = isset($data['birth_year']) ? $data['birth_year'] : null;
        $this->container['email_address'] = isset($data['email_address']) ? $data['email_address'] : null;
        $this->container['no_email'] = isset($data['no_email']) ? $data['no_email'] : null;
        $this->container['phone_number'] = isset($data['phone_number']) ? $data['phone_number'] : null;
        $this->container['phone_number_type'] = isset($data['phone_number_type']) ? $data['phone_number_type'] : null;
        $this->container['no_phone'] = isset($data['no_phone']) ? $data['no_phone'] : null;
        $this->container['same_address'] = isset($data['same_address']) ? $data['same_address'] : null;
        $this->container['relationship'] = isset($data['relationship']) ? $data['relationship'] : null;
        $this->container['work_in_region'] = isset($data['work_in_region']) ? $data['work_in_region'] : null;
    }

    /**
     * Show all the invalid properties with reasons.
     *
     * @return array invalid properties with reasons
     */
    public function listInvalidProperties()
    {
        $invalidProperties = [];

        if ($this->container['address'] === null) {
            $invalidProperties[] = "'address' can't be null";
        }
        if ($this->container['work_address'] === null) {
            $invalidProperties[] = "'work_address' can't be null";
        }
        return $invalidProperties;
    }

    /**
     * Validate all the properties in the model
     * return true if all passed
     *
     * @return bool True if all properties are valid
     */
    public function valid()
    {
        return count($this->listInvalidProperties()) === 0;
    }


    /**
     * Gets id
     *
     * @return string
     */
    public function getId()
    {
        return $this->container['id'];
    }

    /**
     * Sets id
     *
     * @param string $id id
     *
     * @return $this
     */
    public function setId($id)
    {
        $this->container['id'] = $id;

        return $this;
    }

    /**
     * Gets created_at
     *
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->container['created_at'];
    }

    /**
     * Sets created_at
     *
     * @param \DateTime $created_at created_at
     *
     * @return $this
     */
    public function setCreatedAt($created_at)
    {
        $this->container['created_at'] = $created_at;

        return $this;
    }

    /**
     * Gets updated_at
     *
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->container['updated_at'];
    }

    /**
     * Sets updated_at
     *
     * @param \DateTime $updated_at updated_at
     *
     * @return $this
     */
    public function setUpdatedAt($updated_at)
    {
        $this->container['updated_at'] = $updated_at;

        return $this;
    }

    /**
     * Gets address
     *
     * @return \Swagger\Client\Model\AddressUpdateDto
     */
    public function getAddress()
    {
        return $this->container['address'];
    }

    /**
     * Sets address
     *
     * @param \Swagger\Client\Model\AddressUpdateDto $address address
     *
     * @return $this
     */
    public function setAddress($address)
    {
        $this->container['address'] = $address;

        return $this;
    }

    /**
     * Gets work_address
     *
     * @return \Swagger\Client\Model\AddressUpdateDto
     */
    public function getWorkAddress()
    {
        return $this->container['work_address'];
    }

    /**
     * Sets work_address
     *
     * @param \Swagger\Client\Model\AddressUpdateDto $work_address work_address
     *
     * @return $this
     */
    public function setWorkAddress($work_address)
    {
        $this->container['work_address'] = $work_address;

        return $this;
    }

    /**
     * Gets order_id
     *
     * @return float
     */
    public function getOrderId()
    {
        return $this->container['order_id'];
    }

    /**
     * Sets order_id
     *
     * @param float $order_id order_id
     *
     * @return $this
     */
    public function setOrderId($order_id)
    {
        $this->container['order_id'] = $order_id;

        return $this;
    }

    /**
     * Gets first_name
     *
     * @return string
     */
    public function getFirstName()
    {
        return $this->container['first_name'];
    }

    /**
     * Sets first_name
     *
     * @param string $first_name first_name
     *
     * @return $this
     */
    public function setFirstName($first_name)
    {
        $this->container['first_name'] = $first_name;

        return $this;
    }

    /**
     * Gets middle_name
     *
     * @return string
     */
    public function getMiddleName()
    {
        return $this->container['middle_name'];
    }

    /**
     * Sets middle_name
     *
     * @param string $middle_name middle_name
     *
     * @return $this
     */
    public function setMiddleName($middle_name)
    {
        $this->container['middle_name'] = $middle_name;

        return $this;
    }

    /**
     * Gets last_name
     *
     * @return string
     */
    public function getLastName()
    {
        return $this->container['last_name'];
    }

    /**
     * Sets last_name
     *
     * @param string $last_name last_name
     *
     * @return $this
     */
    public function setLastName($last_name)
    {
        $this->container['last_name'] = $last_name;

        return $this;
    }

    /**
     * Gets birth_month
     *
     * @return string
     */
    public function getBirthMonth()
    {
        return $this->container['birth_month'];
    }

    /**
     * Sets birth_month
     *
     * @param string $birth_month birth_month
     *
     * @return $this
     */
    public function setBirthMonth($birth_month)
    {
        $this->container['birth_month'] = $birth_month;

        return $this;
    }

    /**
     * Gets birth_day
     *
     * @return string
     */
    public function getBirthDay()
    {
        return $this->container['birth_day'];
    }

    /**
     * Sets birth_day
     *
     * @param string $birth_day birth_day
     *
     * @return $this
     */
    public function setBirthDay($birth_day)
    {
        $this->container['birth_day'] = $birth_day;

        return $this;
    }

    /**
     * Gets birth_year
     *
     * @return string
     */
    public function getBirthYear()
    {
        return $this->container['birth_year'];
    }

    /**
     * Sets birth_year
     *
     * @param string $birth_year birth_year
     *
     * @return $this
     */
    public function setBirthYear($birth_year)
    {
        $this->container['birth_year'] = $birth_year;

        return $this;
    }

    /**
     * Gets email_address
     *
     * @return string
     */
    public function getEmailAddress()
    {
        return $this->container['email_address'];
    }

    /**
     * Sets email_address
     *
     * @param string $email_address email_address
     *
     * @return $this
     */
    public function setEmailAddress($email_address)
    {
        $this->container['email_address'] = $email_address;

        return $this;
    }

    /**
     * Gets no_email
     *
     * @return bool
     */
    public function getNoEmail()
    {
        return $this->container['no_email'];
    }

    /**
     * Sets no_email
     *
     * @param bool $no_email no_email
     *
     * @return $this
     */
    public function setNoEmail($no_email)
    {
        $this->container['no_email'] = $no_email;

        return $this;
    }

    /**
     * Gets phone_number
     *
     * @return string
     */
    public function getPhoneNumber()
    {
        return $this->container['phone_number'];
    }

    /**
     * Sets phone_number
     *
     * @param string $phone_number phone_number
     *
     * @return $this
     */
    public function setPhoneNumber($phone_number)
    {
        $this->container['phone_number'] = $phone_number;

        return $this;
    }

    /**
     * Gets phone_number_type
     *
     * @return string
     */
    public function getPhoneNumberType()
    {
        return $this->container['phone_number_type'];
    }

    /**
     * Sets phone_number_type
     *
     * @param string $phone_number_type phone_number_type
     *
     * @return $this
     */
    public function setPhoneNumberType($phone_number_type)
    {
        $this->container['phone_number_type'] = $phone_number_type;

        return $this;
    }

    /**
     * Gets no_phone
     *
     * @return bool
     */
    public function getNoPhone()
    {
        return $this->container['no_phone'];
    }

    /**
     * Sets no_phone
     *
     * @param bool $no_phone no_phone
     *
     * @return $this
     */
    public function setNoPhone($no_phone)
    {
        $this->container['no_phone'] = $no_phone;

        return $this;
    }

    /**
     * Gets same_address
     *
     * @return string
     */
    public function getSameAddress()
    {
        return $this->container['same_address'];
    }

    /**
     * Sets same_address
     *
     * @param string $same_address same_address
     *
     * @return $this
     */
    public function setSameAddress($same_address)
    {
        $this->container['same_address'] = $same_address;

        return $this;
    }

    /**
     * Gets relationship
     *
     * @return string
     */
    public function getRelationship()
    {
        return $this->container['relationship'];
    }

    /**
     * Sets relationship
     *
     * @param string $relationship relationship
     *
     * @return $this
     */
    public function setRelationship($relationship)
    {
        $this->container['relationship'] = $relationship;

        return $this;
    }

    /**
     * Gets work_in_region
     *
     * @return string
     */
    public function getWorkInRegion()
    {
        return $this->container['work_in_region'];
    }

    /**
     * Sets work_in_region
     *
     * @param string $work_in_region work_in_region
     *
     * @return $this
     */
    public function setWorkInRegion($work_in_region)
    {
        $this->container['work_in_region'] = $work_in_region;

        return $this;
    }
    /**
     * Returns true if offset exists. False otherwise.
     *
     * @param integer $offset Offset
     *
     * @return boolean
     */
    public function offsetExists($offset)
    {
        return isset($this->container[$offset]);
    }

    /**
     * Gets offset.
     *
     * @param integer $offset Offset
     *
     * @return mixed
     */
    public function offsetGet($offset)
    {
        return isset($this->container[$offset]) ? $this->container[$offset] : null;
    }

    /**
     * Sets value based on offset.
     *
     * @param integer $offset Offset
     * @param mixed   $value  Value to be set
     *
     * @return void
     */
    public function offsetSet($offset, $value)
    {
        if (is_null($offset)) {
            $this->container[] = $value;
        } else {
            $this->container[$offset] = $value;
        }
    }

    /**
     * Unsets offset.
     *
     * @param integer $offset Offset
     *
     * @return void
     */
    public function offsetUnset($offset)
    {
        unset($this->container[$offset]);
    }

    /**
     * Gets the string presentation of the object
     *
     * @return string
     */
    public function __toString()
    {
        if (defined('JSON_PRETTY_PRINT')) { // use JSON pretty print
            return json_encode(
                ObjectSerializer::sanitizeForSerialization($this),
                JSON_PRETTY_PRINT
            );
        }

        return json_encode(ObjectSerializer::sanitizeForSerialization($this));
    }
}
