import {Parameter}  from "@/script/api/objects/Parameter";
import {searchParamToString} from "@/script/api/apiUrl";

test('paramToString multiple',  () =>
{
  const value = searchParamToString([new Parameter("limit", 10), new Parameter("page", 3)])
  expect(value).toBe("?limit=10&pages=3");
});

test('paramToString unique',  () =>
{
  const value = searchParamToString([new Parameter("limit", 10)])
  expect(value).toBe("?limit=10");
});

test('paramToString vide',  () =>
{
  const value = searchParamToString([])
  expect(value).toBe("");
});

test('paramToString undefined',  () =>
{
  const value = searchParamToString([new Parameter("limit", undefined), new Parameter("page", undefined)])
  expect(value).toBe("");
});
