Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.ComponentModel
Imports System.Web.Script.Serialization
Imports System.Web.Script.Services

' To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line.
<System.Web.Script.Services.ScriptService()>
<System.Web.Services.WebService(Namespace:="http://localhost.paths/")>
<System.Web.Services.WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<ToolboxItem(False)>
Public Class Paths
    Inherits System.Web.Services.WebService

    Const START_VALUE = 2, END_VALUE = 3

    Private Class Point
        Public x As Integer, y As Integer

        Function isEqual(ByRef newPoint As Point)
            Return (newPoint.x = x And newPoint.y = y)
        End Function

        Sub New(_x As Integer, _y As Integer)
            x = _x
            y = _y
        End Sub
    End Class

    Private Class MovementStep
        Public xMove As Integer,
            yMove As Integer,
            path As Path,
            isValid As Boolean

        Sub New(Optional _x As Integer = 0, Optional _y As Integer = 0, Optional _path As Path = Nothing, Optional _valid As Boolean = False)
            xMove = _x
            yMove = _y
            path = _path
            isValid = _valid

        End Sub

    End Class

    Private Class PathList
        Public Paths As New List(Of Path)
        Public ShortList As Path
        Public LongList As Path

        Public Sub Add(ByVal thePath As Path)
            Paths.Add(thePath)

            If (IsNothing(ShortList) OrElse ShortList.GetPath.Count > thePath.GetPath.Count) Then
                ShortList = thePath
            End If

            If (IsNothing(LongList) OrElse LongList.GetPath.Count < thePath.GetPath.Count) Then
                LongList = thePath
            End If
        End Sub

        Public Sub Merge(ByVal List1 As List(Of Path))
            For Each newPath As Path In List1
                Add(newPath)
            Next
        End Sub

    End Class

    Private Class Path
        Public ctx As Path
        Public ValidPointAry As New List(Of Point) 'only a list of valid points
        Public PointAry As New List(Of Point) 'a list Of valid And invalid points, used to keep track of what we have checked

        Public isValid As Boolean = False

        Public startPoint As Point, endPoint As Point, pathFind As PathFinder

        Sub New()

        End Sub

        Sub New(_startPoint As Point, _endPoint As Point, _pathFind As PathFinder)
            ctx = Me

            startPoint = _startPoint
            endPoint = _endPoint
            pathFind = _pathFind

            ValidPointAry.Add(startPoint)

        End Sub

        Private Function MergeListPathHelper(List1 As List(Of Point), List2 As List(Of Point)) As List(Of Point)
            Return (From theObj In List1
                    Select theObj).Union(
                    From theSecondObj In List2
                    Select theSecondObj).ToList
        End Function

        Function AddPoint(ByRef newPoint As Point) As Boolean
            If (Not FindPointInPath(newPoint)) Then
                If (pathFind.IsDestinationValid(newPoint, 0, 0)) Then
                    ValidPointAry.Add(newPoint)
                End If

                PointAry.Add(newPoint)

                If (newPoint.isEqual(endPoint)) Then
                    isValid = True

                End If

                Return True

            End If
            Return False

        End Function

        Function GetPath() As List(Of Point)
            Return MergeListPathHelper(New List(Of Point), ValidPointAry)
        End Function

        Function GetPoints() As List(Of Point)
            Return MergeListPathHelper(New List(Of Point), PointAry)
        End Function

        Function GetValid() As Boolean
            Return isValid
        End Function

        Sub SetPath(ByVal _pointAry As List(Of Point))
            ValidPointAry = _pointAry
        End Sub

        Sub SetPoints(ByVal _pointAry As List(Of Point))
            PointAry = _pointAry
        End Sub

        Sub SetValid(ByVal _valid As Boolean)
            isValid = _valid
        End Sub

        Function GetPathFind() As PathFinder
            Return pathFind
        End Function

        Sub SetPathFind(ByVal _pathFinder As PathFinder)
            pathFind = _pathFinder
        End Sub

        Sub SetEndPoint(ByVal _point As Point)
            endPoint = _point
        End Sub

        Function GetEndPoint()
            Return endPoint
        End Function

        Function CopyPath() As Path
            Dim newPath As New Path

            newPath.SetPath(GetPath())
            newPath.SetPoints(GetPoints())
            newPath.SetValid(GetValid())
            newPath.SetEndPoint(GetEndPoint())
            newPath.SetPathFind(GetPathFind())

            Return newPath
        End Function

        'return true if we find the point in the list of valid And invalid checked points
        Function FindPointInPath(ByVal newPoint As Point) As Boolean
            For i = 0 To PointAry.Count - 1
                If (newPoint.isEqual(PointAry.Item(i))) Then
                    Return True
                End If
            Next
            Return False
        End Function
    End Class

    Private Class PathFinder
        Dim minStepCount As Integer = -1
        Dim bolMin As Boolean = false
        Const ERR_VAL_NOT_FOUND As String = "Value not Found"
        Dim patternArry As List(Of Integer())

        Sub New(pattern As List(Of Integer()))
            patternArry = pattern
        End Sub

        Function FindStartPoint() As Point
            Return FindByValue(START_VALUE)
        End Function

        Function FindEndPoint() As Point
            Return FindByValue(END_VALUE)
        End Function

        Function FindByValue(value) As Point
            For y = 0 To patternArry.Count - 1
                For x = 0 To patternArry.Item(y).Length - 1
                    If (patternArry.Item(y)(x) = value) Then
                        Return New Point(x, y)
                    End If
                Next
            Next

            Throw New Exception(ERR_VAL_NOT_FOUND)

        End Function


        Function IsDestinationValid(startPoint As Point, xMove As Integer, yMove As Integer) As Boolean
            Dim newX As Integer = startPoint.x + xMove,
                newY As Integer = startPoint.y + yMove

            If (newY < 0 Or newX < 0) Then
                Return False
            ElseIf (newY >= patternArry.Count)
                Return False

            ElseIf (newX >= patternArry.Item(newY).Length) Then
                Return False
            End If

            Return (patternArry.Item(newY)(newX) = 0 Or patternArry.Item(newY)(newX) = END_VALUE)
        End Function

        Function FindValidPaths(ByVal Optional bolMinimize As Boolean = False) As PathList
            bolMin = bolMinimize

            'bolMinimize: once the program finds a path from start to end, it will keep track of
            'the number of steps from start to end.  As subsequent paths are found, once the
            'number of steps are greater than that first path, thhat particular path gets skipped...
            'If a shorter path is found, those number of steps become the default and any current paths
            'get skipped as a result....hopefully this will help speed up large searches

            Dim StartPoint As Point = FindStartPoint(), EndPoint As Point = FindEndPoint(),
                PathAry As New List(Of Path), thePathList As New PathList

            'move left
            If (IsDestinationValid(StartPoint, -1, 0)) Then
                'PathAry = MergeListPathHelper(PathAry, DoMove(StartPoint, EndPoint, -1, 0))
                thePathList.Merge(DoMove(StartPoint, EndPoint, -1, 0))
            End If
            'move right
            If (IsDestinationValid(StartPoint, 1, 0)) Then
                'PathAry = MergeListPathHelper(PathAry, DoMove(StartPoint, EndPoint, 1, 0))
                thePathList.Merge(DoMove(StartPoint, EndPoint, 1, 0))
            End If
            'move up
            If (IsDestinationValid(StartPoint, 0, -1)) Then
                'PathAry = MergeListPathHelper(PathAry, DoMove(StartPoint, EndPoint, 0, -1))
                thePathList.Merge(DoMove(StartPoint, EndPoint, 0, -1))
            End If
            'move down
            If (IsDestinationValid(StartPoint, 0, 1)) Then
                'PathAry = MergeListPathHelper(PathAry, DoMove(StartPoint, EndPoint, 0, 1))
                thePathList.Merge(DoMove(StartPoint, EndPoint, 0, 1))
            End If

            Return thePathList
        End Function

        Function FindFirstShortestPath(PathAry As List(Of Integer())) As Integer()
            Dim ShortIndex = -1, shortLength = -1
            Dim i As Integer

            For i = 0 To PathAry.Count - 1
                If (shortLength = -1 Or PathAry.Item(i).Length < shortLength) Then
                    shortLength = PathAry.Item(i).Length
                    ShortIndex = i
                End If
            Next

            Return PathAry.Item(i)
        End Function

        Function FindFirstLongestPath(PathAry As List(Of Integer())) As Integer()

            Dim longIndex = -1, longLength = -1
            Dim i As Integer

            For i = 0 To PathAry.Count - 1
                If (longLength = -1 Or PathAry.Item(i).Length > longLength) Then
                    longLength = PathAry.Item(i).Length
                    longIndex = i
                End If
            Next

            Return PathAry.Item(i)
        End Function

        Function DoMove(ByVal originalPoint As Point, endPoint As Point, xMove As Integer, yMove As Integer, Optional currentPath As Path = Nothing, Optional curSteps As Integer = 0) As List(Of Path)
            Dim PathAry As New List(Of Path)

            If bolMin And curSteps > minStepCount And minStepCount <> -1 Then
                Return PathAry
            End If


            'increment the step count
            curSteps += 1

            'store the current Point in the path
            Dim startPoint = New Point(originalPoint.x + xMove, originalPoint.y + yMove)

            If (IsNothing(currentPath)) Then
                currentPath = New Path(originalPoint, endPoint, Me)

                'check if startpoint And endpoint are the same...no need to go further if it Is
                If (startPoint.isEqual(endPoint)) Then
                    PathAry.Add(currentPath)
                End If
            End If

            Dim wasPointAdded As Boolean = currentPath.AddPoint(startPoint)

            If (Not wasPointAdded) Then
                Return PathAry 'If we didn't add the point because it already existed, exit this iteration
            End If

            Dim Steps As New List(Of MovementStep)

            'move left
            Steps.Add(New MovementStep(-1, 0, currentPath.CopyPath(), False))

            'right
            Steps.Add(New MovementStep(1, 0, currentPath.CopyPath(), False))

            'up
            Steps.Add(New MovementStep(0, -1, currentPath.CopyPath(), False))

            'down
            Steps.Add(New MovementStep(0, 1, currentPath.CopyPath(), False))

            For i = 0 To Steps.Count - 1
                If (IsDestinationValid(startPoint, Steps.Item(i).xMove, Steps.Item(i).yMove) And Not currentPath.GetValid()) Then
                    Dim thePoint As New Point(startPoint.x + Steps.Item(i).xMove, startPoint.y + Steps.Item(i).yMove)

                    If Not currentPath.FindPointInPath(thePoint) Then
                        Dim newPath = DoMove(startPoint, endPoint, Steps.Item(i).xMove, Steps.Item(i).yMove, Steps.Item(i).path.CopyPath, curSteps)
                        PathAry = MergeListPathHelper(PathAry, newPath)
                    End If
                ElseIf startPoint.isEqual(endPoint)
                    PathAry.Add(currentPath)

                    If curSteps < minStepCount Or minStepCount = -1 Then
                        minStepCount = curSteps
                    End If

                    Exit For
                End If
            Next

            Return PathAry
        End Function


        Function MergeListPathHelper(List1 As List(Of Path), List2 As List(Of Path)) As List(Of Path)
            Return (From theObj In List1
                    Select theObj).Union(
                    From theSecondObj In List2
                    Select theSecondObj).ToList
        End Function
    End Class

    Private Class optionSample
        Public pattern As List(Of Integer())
        Public MinPath As Boolean = False
    End Class

    <WebMethod()>
    <ScriptMethod()>
    Public Function GetPathInfo(strOptions As String) As String
        Dim serial As New JavaScriptSerializer()

        Dim options As optionSample = serial.Deserialize(Of optionSample)(strOptions)

        Dim theSerializedPattern = options.pattern

        Dim pf As New PathFinder(theSerializedPattern)
        Dim thePaths = pf.FindValidPaths(options.MinPath)

        Return serial.Serialize(thePaths)
        End Function

    '<WebMethod()>
    '<ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    'Public Function Test() As String
    '    Dim serial As New JavaScriptSerializer()
    '    Dim pattern = "[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 3, 0, 2, 0], [0, 0, 0, 0, 0]]"
    '    Dim theSerializedPattern = serial.Deserialize(Of List(Of Integer()))(pattern)
    '    Dim pf As New PathFinder(theSerializedPattern)
    '    Dim thePaths = pf.FindValidPaths(True)
    '    Return serial.Serialize(thePaths)
    'End Function



End Class