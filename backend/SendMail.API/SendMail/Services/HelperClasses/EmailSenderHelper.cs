using Newtonsoft.Json;

namespace SendMail.Services.HelperClasses
{
    public static class EmailSenderHelper
    {
        public static T DeepCopy<T>(T objectToClone)
        {
            // Does a deep clone of an object by serializing/deserializing it
            return JsonConvert.DeserializeObject<T>(JsonConvert.SerializeObject(objectToClone));
        }
    }
}
