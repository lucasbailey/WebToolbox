function Heaps() {
    //heap's only real requirement is that parent nodes be greater than children nodes
    //by definition, the largest number must be at the top of the heap

    //heaps are usually implemented via arrays

    var Heap = [];
    //15, 12, 11, 6, 1, 9, 10

    this.load = function (AryList, bolReverse) {
        bolReverse = (bolReverse == null ? false : bolReverse);
        Heap = AryList.slice();
        _balance(bolReverse);
    }

    this.reverse = function () {
        _balance(true);
    }

    //this function will go through all the nodes and ensure 
    //that the parent nodes are always > children.
    //if they aren't it will call the swap function to swap the 
    //parent and child.

    function _balance(bolReverse) {
        var isDirty = false;

        for (var i = 0; i < Heap.length - 2; i++) {
            var indexToSwap = (
                (bolReverse == false ?
                    Heap[2 * i + 1] < Heap[2 * i + 2] ? 2 * i + 2 : 2 * i + 1
                    :
                    Heap[2 * i + 1] > Heap[2 * i + 2] ? 2 * i + 2 : 2 * i + 1
                    )
                ); //find the bigger of the two children

            if ((Heap[i] < Heap[indexToSwap] && !bolReverse) || (Heap[i] > Heap[indexToSwap] && bolReverse)) {
                _SwapValues(i, indexToSwap);
                isDirty = true;
            }
        }
        if (isDirty) {
            _balance(bolReverse);
        }
        return isDirty;
    }

    function _SwapValues(indexOne, indexTwo) {
        var temp = Heap[indexOne];
        Heap[indexOne] = Heap[indexTwo];
        Heap[indexTwo] = temp;
    }

    this.GetHeap = function () {
        return Heap;
    }

    this.DisplayHTML = function (destObj) {
        var strToDisplay = "";
        var StartRow = 0, EndRow = 0, j = 1;
        for (var i = 0; i < Heap.length; i++) {
            if (i == StartRow) {
                strToDisplay += "<div style='width: 100%; display: flex;'>";
                StartRow = EndRow + 1;
            }
            strToDisplay += "<div style='border: solid black 1px; flex: 1; text-align: center;'>"
                         + Heap[i]
                         + "</div>";
            if (i == EndRow) {
                strToDisplay += "</div>";

                EndRow = Math.pow(2, j) + EndRow;
                j++;
            }
        }

        //put placeholders for the last row,
        //ensures the last row's items line up appropriately with their parents

        for (var i = Heap.length; i <= EndRow; i++) {
            strToDisplay += "<div style='border: solid black 1px; flex: 1; text-align: center;'>"
                         + "&nbsp;"
                         + "</div>";
            if (i == EndRow) {
                strToDisplay += "</div>";
            }
        }

        destObj.innerHTML = strToDisplay;
    }
}