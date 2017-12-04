def UnitTest = new rackhd.UnitTest.UnitTest()

UnitTest.test_repos = ["on-wss", "on-web-ui"]
UnitTest.setRunScript('pipeline/UnitTest/unit_test.sh')

return UnitTest